import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth';
import { auth } from './firebaseConfig'; // Убедитесь, что путь правильный
import { useUser } from './UserContext';

const SignUpScreen = ({ navigation }) => {
    const { login } = useUser();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');

    const validateInputs = () => {
        if (!email || !password || !name || !surname) {
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

            // ✅ Добавляем id
            const userData = {
                id: userCredential.user.uid,
                email: userCredential.user.email,
                name,
                surname,
                subscription: 'free',
            };

            login(userData);
            Alert.alert('Регистрация успешна!', 'Пожалуйста, подтвердите ваш email.');
        } catch (error) {
            Alert.alert('Ошибка', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Регистрация</Text>
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
                <Pressable style={styles.authButton} onPress={handleSignUp}>
                    <Text style={styles.authText}>Зарегистрироваться</Text>
                </Pressable>
            )}

            <Pressable onPress={() => navigation.replace('Auth')}>
                <Text style={styles.switchText}>Уже есть аккаунт? Войти</Text>
            </Pressable>
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
});

export default SignUpScreen;
