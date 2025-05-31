import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification, onAuthStateChanged, sendPasswordResetEmail } from 'firebase/auth';
import { auth, rtdb } from './firebaseConfig';
import { useUser } from './UserContext';
import { updateProfile } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDatabase, ref, get, set } from 'firebase/database';  // Импортируем методы для работы с Realtime Database

const AuthScreen = ({ navigation }) => {
    const { login } = useUser();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user && user.emailVerified) {
                const storedSubscription = await AsyncStorage.getItem('userSubscription');
                const userSubscription = storedSubscription || 'free'; // Если подписка не найдена, то 'free'

                login({
                    email: user.email,
                    name: user.displayName?.split(' ')[0] || '',
                    surname: user.displayName?.split(' ')[1] || '',
                    subscription: userSubscription,
                });

                if (!loading) {  // Предотвращает множественный вызов replace
                    navigation.replace('Profile');
                }
            }
        });

        return () => unsubscribe(); // Отписываемся от слушателя
    }, [navigation, login, loading]);

    const validateInputs = () => {
        if (!email || !password || (isRegistering && (!name || !surname))) {
            Alert.alert('Ошибка', 'Пожалуйста, заполните все поля.');
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            Alert.alert('Ошибка', 'Введите корректный email.');
            return false;
        }
        if (password.length < 6) {
            Alert.alert('Ошибка', 'Пароль должен содержать минимум 6 символов.');
            return false;
        }
        return true;
    };

    const handleSignUp = async () => {
        if (!validateInputs()) return;
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await sendEmailVerification(userCredential.user);

            // Обновление профиля пользователя
            await updateProfile(userCredential.user, {
                displayName: `${name} ${surname}`,
            });

            // 📅 Устанавливаем срок подписки на 3 дня
            const now = new Date();
            const expiry = new Date(now);
            expiry.setDate(now.getDate() + 3);
            const subscriptionExpiry = expiry.toISOString(); // сохраняем в формате ISO

            // ✅ Собираем данные пользователя
            const userData = {
                id: userCredential.user.uid,
                email: userCredential.user.email,
                name,
                surname,
                subscription: '3day',
                subscriptionExpiry, // 👈 добавлено
                createdWorksCount: 0,
                createdWorks: 0,
            };

            // Сохраняем в Realtime Database
            await set(ref(rtdb, 'users/' + userCredential.user.uid), userData);

            // Обновляем контекст
            login(userData);

            Alert.alert('Регистрация успешна!', 'Пожалуйста, подтвердите ваш email.');
        } catch (error) {
            Alert.alert('Ошибка', error.message);
        } finally {
            setLoading(false);
        }
    };



    const handleLogin = async () => {
        if (!validateInputs()) return;
        setLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            if (!userCredential.user.emailVerified) {
                Alert.alert('Ошибка', 'Пожалуйста, подтвердите ваш email перед входом.');
                return;
            }

            // Принудительно обновляем данные пользователя
            await userCredential.user.reload();
            const updatedUser = auth.currentUser; // Получаем актуальные данные

            // Загружаем имя и фамилию из displayName
            const displayName = updatedUser.displayName || '';
            const [firstName, lastName] = displayName.split(' ');

            // Загружаем подписку из AsyncStorage
            const storedSubscription = await AsyncStorage.getItem('userSubscription');
            const userSubscription = storedSubscription || 'free'; // ✅ вместо 'free'

            // ✅ Добавляем id и подписку
            const userData = {
                id: updatedUser.uid,
                email: updatedUser.email,
                name: firstName || '',
                surname: lastName || '',
                subscription: userSubscription, // Получаем подписку из AsyncStorage
            };

            // Принудительно обновляем user с новой подпиской
            login(userData); // Передаем в контекст
            await AsyncStorage.setItem('user', JSON.stringify(userData)); // Сохраняем в AsyncStorage как 'user'

            navigation.replace('Profile');
        } catch (error) {
            Alert.alert('Ошибка', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!email) {
            Alert.alert('Ошибка', 'Введите ваш email для сброса пароля.');
            return;
        }
        try {
            await sendPasswordResetEmail(auth, email);
            Alert.alert('Успех', 'Письмо с инструкциями по сбросу пароля отправлено на вашу почту.');
        } catch (error) {
            Alert.alert('Ошибка', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{isRegistering ? 'Регистрация' : 'Войти в аккаунт'}</Text>

            {isRegistering && (
                <>
                    <TextInput
                        style={styles.input}
                        placeholder="Имя"
                        placeholderTextColor="#aaa"
                        value={name}
                        onChangeText={setName}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Фамилия"
                        placeholderTextColor="#aaa"
                        value={surname}
                        onChangeText={setSurname}
                    />
                </>
            )}

            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#aaa"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Пароль"
                placeholderTextColor="#aaa"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            {loading ? (
                <ActivityIndicator size="large" color="#007AFF" />
            ) : (
                <>
                    <Pressable
                        style={styles.authButton}
                        onPress={isRegistering ? handleSignUp : handleLogin}
                    >
                        <Text style={styles.authText}>{isRegistering ? 'Зарегистрироваться' : 'Войти'}</Text>
                    </Pressable>
                    <Pressable onPress={handleForgotPassword}>
                        <Text style={styles.switchText}>Забыли пароль?</Text>
                    </Pressable>
                    <Pressable onPress={() => setIsRegistering(!isRegistering)}>
                        <Text style={styles.switchText}>{isRegistering ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}</Text>
                    </Pressable>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1E1E1E', padding: 20 },
    title: { fontSize: 26, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
    input: { width: '100%', padding: 15, borderWidth: 1, borderColor: '#444', borderRadius: 10, marginVertical: 8, color: '#fff', backgroundColor: '#2E2E2E' },
    authButton: { width: '100%', padding: 15, borderRadius: 10, alignItems: 'center', marginVertical: 8, backgroundColor: '#007AFF' },
    authText: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
    switchText: { color: '#34C759', marginTop: 20 },
    forgotPasswordText: { color: '#FFA500', marginTop: 20 },
    photoButton: { width: '100%', padding: 15, borderRadius: 10, alignItems: 'center', backgroundColor: '#34C759', marginVertical: 8 },
    photo: { width: 100, height: 100, borderRadius: 50, marginTop: 10 },
});

export default AuthScreen;
