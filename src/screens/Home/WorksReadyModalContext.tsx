import React, { createContext, useState, useContext, useEffect } from 'react';
import { useUser } from '../../../src/screens/Home/UserContext'; // Импортируем UserContext
import { db, auth } from '../../../src/screens/Home/firebaseConfig'; // Предполагаем, что у вас есть db, настроенный для Firestore
import { collection, getDocs, query, where } from 'firebase/firestore'; // Импортируем функции Firestore
import { onAuthStateChanged } from 'firebase/auth'; // Импортируем для получения состояния аутентификации

const WorksReadyModalContext = createContext();

export const useWorksReadyModal = () => useContext(WorksReadyModalContext);

export const WorksReadyModalProvider = ({ children }) => {
    const { user, userRole } = useUser(); // Получаем информацию о пользователе и его роли
    const [worksReadyModalVisible, setWorksReadyModalVisible] = useState(false);
    const [works, setWorks] = useState([]);
    const [searchQuery, setSearch] = useState('');
    const [loading, setLoading] = useState(false);

    // Проверка наличия аутентифицированного пользователя и загрузка работ
    useEffect(() => {
        const loadWorks = async () => {
            if (!user || !user.uid) {  // Проверка на наличие user и user.uid
                console.log('Ошибка: нет данных пользователя или UID');
                return;
            }

            console.log('UID пользователя:', user.uid); // Логируем UID для отладки

            setLoading(true);
            try {
                const worksRef = collection(db, 'works');
                const q = query(worksRef, where('userId', '==', user.uid)); // Фильтрация по UID
                const querySnapshot = await getDocs(q);

                if (querySnapshot.empty) {
                    console.log('Нет работ для этого пользователя');
                    setWorks([]);
                    return;
                }

                const userWorks = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setWorks(userWorks);
            } catch (error) {
                console.error('Ошибка при получении работ: ', error);
            } finally {
                setLoading(false);
            }
        };

        // Печатаем, чтобы понять, что user доступен перед запуском загрузки работ
        console.log('user в useEffect:', user);

        if (user && user.uid) {
            loadWorks();
        }
    }, [user]);  // Зависимость от user, чтобы перезагружать данные при изменении пользователя

    // Слушаем изменения состояния аутентификации
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser && firebaseUser.uid) {  // Проверка на наличие firebaseUser.uid
                setLoading(true);
                console.log('firebaseUser доступен:', firebaseUser); // Логируем firebaseUser для отладки
                try {
                    const q = query(collection(db, 'works'), where('userId', '==', firebaseUser.uid));
                    const querySnapshot = await getDocs(q);
                    const userWorks = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setWorks(userWorks);
                } catch (error) {
                    console.error('Ошибка при получении работ: ', error);
                } finally {
                    setLoading(false);
                }
            } else {
                console.log('Пользователь не авторизован');
                setWorks([]);
            }
        });

        return () => unsubscribe();
    }, []); // Эффект без зависимости от user, так как подписка будет работать на изменения firebaseUser

    // Функция для переключения модала
    const toggleWorksReadyModal = () => {
        setWorksReadyModalVisible(prev => !prev);
    };

    // Функция для удаления работы
    const deleteWork = async (id) => {
        setLoading(true);
        try {
            // Логика для удаления работы из Firestore
            // await deleteDoc(doc(db, 'works', id));  // если используется Firestore для удаления
            setWorks(prevWorks => prevWorks.filter(work => work.id !== id));
        } catch (error) {
            console.error('Ошибка при удалении работы: ', error);
        } finally {
            setLoading(false);
        }
    };

    // Функция для добавления работы в список
    const addWorkToModal = (work) => {
        setLoading(true);
        setWorks(prevWorks => [...prevWorks, work]);
        setLoading(false);
    };

    // Функция для обновления работы в списке
    const updateWorkInModal = (workId, updatedData) => {
        setLoading(true);
        setWorks(prevWorks => prevWorks.map(work =>
            work.id === workId ? { ...work, ...updatedData } : work
        ));
        setLoading(false);
    };

    return (
        <WorksReadyModalContext.Provider
            value={{
                worksReadyModalVisible,
                toggleWorksReadyModal,
                works, // Работы для текущего пользователя
                searchQuery,
                setSearch,
                deleteWork,
                addWorkToModal,
                updateWorkInModal,
                loading,
                userRole, // Роль пользователя, если нужно для фильтрации или управления доступом
            }}
        >
            {children}
        </WorksReadyModalContext.Provider>
    );
};
