import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged, signOut, getAuth } from 'firebase/auth';
import { auth, rtdb } from './firebaseConfig'; // Подключаем Firebase Realtime Database
import { ref, get, set } from 'firebase/database'; // Используем rtdb
import { onValue } from 'firebase/database';

const UserContext = createContext();

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState('Студент'); // Роль по умолчанию

    // Функция входа
    const login = async (userData) => {
        // Получаем текущую дату
        const currentDate = new Date();

        // Добавляем 3 дня к текущей дате
        const expiryDate = new Date(currentDate);
        expiryDate.setDate(currentDate.getDate() + 3);

        // Форматируем дату в строку
        const expiryDateString = expiryDate.toISOString();

        const updatedUser = {
            ...userData,
            subscription: '3day', // Подписка на 3 дня
            subscriptionExpiry: expiryDateString, // Устанавливаем дату окончания подписки
            id: userData.id || user.id,
            createdWorksCount: userData.createdWorksCount || 0,
        };

        setUser(updatedUser);

        // Сохраняем в AsyncStorage
        await AsyncStorage.setItem('userSubscription', updatedUser.subscription);
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        await AsyncStorage.setItem('userSubscriptionExpiry', updatedUser.subscriptionExpiry); // Сохраняем дату окончания подписки в AsyncStorage
        await set(ref(rtdb, 'users/' + updatedUser.id), updatedUser); // Сохраняем в Firebase Realtime Database
    };

    // Функция выхода
    const logout = async () => {
        await signOut(auth);
        // Сохраняем подписку в AsyncStorage перед удалением
        if (user) {
            await AsyncStorage.setItem('userSubscription', user.subscription);
        }
        await AsyncStorage.multiRemove(['user', 'userRole']); // Удаление всех данных
        setUser(null);
        setUserRole('student');
    };

    // Переключение роли
    const switchRole = async () => {
        const newRole = userRole === 'Студент' ? 'Преподаватель' : 'Студент';
        setUserRole(newRole);
        await AsyncStorage.setItem('userRole', newRole);

        if (user) {
            const updatedUser = { ...user, role: newRole };
            setUser(updatedUser);
            await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
            // Обновляем данные в Realtime Database
            await set(ref(rtdb, 'users/' + updatedUser.id), updatedUser);
        }
    };

    // Обновление подписки
    const updateSubscription = async (subscription, paymentMethod = 'Не выбрано', expiry = null) => {
        if (user) {
            const updatedUser = {
                ...user,
                subscription,
                paymentMethod,
                subscriptionExpiry: expiry, // передавай дату окончания, если есть
            };

            await set(ref(rtdb, 'users/' + updatedUser.id), updatedUser);
            setUser(updatedUser);
            await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
            await AsyncStorage.setItem('userSubscription', subscription);
        }
    };

    // Увеличить счетчик созданных работ
    const incrementCreatedWorksCount = async () => {
        if (user) {
            const newCount = (user.createdWorksCount || 0) + 1;
            const updatedUser = { ...user, createdWorksCount: newCount };
            setUser(updatedUser);

            // Сохраняем в AsyncStorage
            await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
            await AsyncStorage.setItem(`createdWorks_${user.email}`, JSON.stringify(newCount)); // Для совместимости

            // Обновляем в Firebase
            await set(ref(rtdb, 'users/' + updatedUser.id), updatedUser);
        }
    };

    // Обновление роли
    const updateRole = async (newRole) => {
        if (user) {
            const updatedUser = { ...user, role: newRole };
            setUser(updatedUser);
            await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
            // Обновляем данные в Realtime Database
            await set(ref(rtdb, 'users/' + updatedUser.id), updatedUser);
        }
    };

    // Функция загрузки данных пользователя из Realtime Database
    const loadUser = async () => {
        try {
            const storedUser = await AsyncStorage.getItem('user');
            const storedRole = await AsyncStorage.getItem('userRole');
            const storedSubscription = await AsyncStorage.getItem('userSubscription');
            const storedSubscriptionExpiry = await AsyncStorage.getItem('userSubscriptionExpiry');

            if (storedUser) {
                let parsedUser = JSON.parse(storedUser);

                // Проверяем, не истекла ли подписка
                if (storedSubscriptionExpiry) {
                    const currentDate = new Date();
                    const expiryDate = new Date(storedSubscriptionExpiry);

                    if (expiryDate < currentDate) {
                        // Подписка истекла, сбрасываем на бесплатную
                        parsedUser.subscription = 'free';
                        parsedUser.subscriptionExpiry = null;
                    }
                }

                // Обновляем пользователя
                setUser(parsedUser);

                // Подписка на изменения данных пользователя в Firebase
                const userRef = ref(rtdb, 'users/' + parsedUser.id);
                onValue(userRef, (snapshot) => {
                    if (snapshot.exists()) {
                        const firestoreUser = snapshot.val();
                        if (firestoreUser.subscription !== parsedUser.subscription ||
                            firestoreUser.subscriptionExpiry !== parsedUser.subscriptionExpiry) {
                            parsedUser.subscription = firestoreUser.subscription;
                            parsedUser.subscriptionExpiry = firestoreUser.subscriptionExpiry || null;
                            setUser(parsedUser);
                            AsyncStorage.setItem('user', JSON.stringify(parsedUser));
                            AsyncStorage.setItem('userSubscription', firestoreUser.subscription);
                            AsyncStorage.setItem('userSubscriptionExpiry', firestoreUser.subscriptionExpiry || '');
                        }
                    }
                });
            }
            setUserRole(storedRole || 'Студент');
        } catch (error) {
            console.error('Ошибка загрузки данных пользователя:', error);
        }
    };

    useEffect(() => {
        loadUser(); // Загружаем данные из AsyncStorage или из Realtime Database при монтировании компонента

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser && firebaseUser.uid) {
                const storedUser = await AsyncStorage.getItem('user');
                const storedRole = await AsyncStorage.getItem('userRole');
                const storedSubscription = await AsyncStorage.getItem('userSubscription');
                const storedSubscriptionExpiry = await AsyncStorage.getItem('userSubscriptionExpiry');

                if (storedUser) {
                    let parsedUser = JSON.parse(storedUser);

                    // Если подписка или дата окончания подписки отсутствуют, обновляем их
                    if (storedSubscription) {
                        parsedUser.subscription = storedSubscription;
                    }

                    if (storedSubscriptionExpiry) {
                        parsedUser.subscriptionExpiry = storedSubscriptionExpiry;
                    }

                    setUser(parsedUser);
                } else {
                    const userData = {
                        id: firebaseUser.uid,
                        email: firebaseUser.email,
                        name: firebaseUser.displayName || '',
                        role: 'Студент',
                        subscription: 'free',
                        subscriptionExpiry: null, // Изначально подписка не активна
                        createdWorksCount: 0,
                        paymentMethod: 'Не выбрано',
                    };

                    setUser(userData);
                    await AsyncStorage.setItem('user', JSON.stringify(userData));
                    await AsyncStorage.setItem('userSubscription', 'free');
                    await AsyncStorage.setItem('userSubscriptionExpiry', ''); // Пустое значение для подписки
                    await set(ref(rtdb, 'users/' + firebaseUser.uid), userData); // Сохраняем данные в Realtime Database
                }

                // Обновляем роль
                if (storedRole) {
                    setUserRole(storedRole);
                } else {
                    setUserRole('Студент');
                    await AsyncStorage.setItem('userRole', 'Студент');
                }
            } else {
                await AsyncStorage.removeItem('user');
                await AsyncStorage.removeItem('userRole');
                await AsyncStorage.removeItem('userSubscription');
                await AsyncStorage.removeItem('userSubscriptionExpiry'); // Удаление данных подписки
                setUser(null);
                setUserRole('Студент');
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <UserContext.Provider value={{
            user,
            setUser,
            userRole,
            login,
            logout,
            switchRole,
            updateSubscription,
            updateRole,
            incrementCreatedWorksCount,
            uid: user?.id,
            subscriptionExpiry: user?.subscriptionExpiry // Добавлено поле с датой окончания подписки
        }}>
            {children}
        </UserContext.Provider>
    );
};
