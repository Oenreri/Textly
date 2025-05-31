import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useUser } from '../../../../src/screens/Home/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { auth } from './firebaseConfig';

const EditProfileScreen = () => {
    const { user, updateUser } = useUser();
    const navigation = useNavigation();

    const [name, setName] = useState(user?.name || '');
    const [surname, setSurname] = useState(user?.surname || '');
    const [email] = useState(user?.email || '');

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const handleSave = async () => {
        if (!name.trim() || !surname.trim()) {
            Alert.alert('Ошибка', 'Имя и фамилия не могут быть пустыми.');
            return;
        }

        const updatedUser = { ...user, name, surname };
        await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
        updateUser(updatedUser);

        Alert.alert('Успех', 'Данные профиля обновлены.');
        navigation.goBack();
    };

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmNewPassword) {
            Alert.alert('Ошибка', 'Заполните все поля для смены пароля.');
            return;
        }

        if (newPassword !== confirmNewPassword) {
            Alert.alert('Ошибка', 'Новый пароль и подтверждение не совпадают.');
            return;
        }

        try {
            const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
            await reauthenticateWithCredential(auth.currentUser, credential);

            await updatePassword(auth.currentUser, newPassword);
            Alert.alert('Успех', 'Пароль успешно изменен.');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        } catch (error) {
            Alert.alert('Ошибка', 'Не удалось сменить пароль. ' + error.message);
        }
    };

    return (
        <LinearGradient colors={['#F4E7D4', '#D2A679']} style={styles.background}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Редактировать профиль</Text>

                <View style={styles.inputContainer}>
                    <Icon name="person" size={20} color="#8B4513" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Имя"
                        placeholderTextColor="#6B4226"
                        value={name}
                        onChangeText={setName}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Icon name="person" size={20} color="#8B4513" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Фамилия"
                        placeholderTextColor="#6B4226"
                        value={surname}
                        onChangeText={setSurname}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Icon name="email" size={20} color="#8B4513" style={styles.icon} />
                    <TextInput
                        style={[styles.input, styles.disabledInput]}
                        value={email}
                        editable={false}
                    />
                </View>

                <TouchableOpacity style={styles.button} onPress={handleSave}>
                    <Text style={styles.buttonText}>Сохранить</Text>
                </TouchableOpacity>

                <Text style={styles.subtitle}>Смена пароля</Text>

                <View style={styles.inputContainer}>
                    <Icon name="lock" size={20} color="#8B4513" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Текущий пароль"
                        placeholderTextColor="#6B4226"
                        secureTextEntry
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Icon name="lock" size={20} color="#8B4513" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Новый пароль"
                        placeholderTextColor="#6B4226"
                        secureTextEntry
                        value={newPassword}
                        onChangeText={setNewPassword}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Icon name="lock" size={20} color="#8B4513" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Подтвердите новый пароль"
                        placeholderTextColor="#6B4226"
                        secureTextEntry
                        value={confirmNewPassword}
                        onChangeText={setConfirmNewPassword}
                    />
                </View>

                <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
                    <Text style={styles.buttonText}>Изменить пароль</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonCancel} onPress={() => navigation.goBack()}>
                    <Text style={styles.buttonText}>Отмена</Text>
                </TouchableOpacity>
            </ScrollView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    container: {
        alignItems: 'flex-start', // Aligning content to the left
        paddingVertical: 20,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#4A2C2A',
        marginBottom: 25,
        textAlign: 'left', // Left-aligning the title
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 15,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        backgroundColor: '#FAE5D3',
        borderRadius: 12,
        padding: 14,
        width: '80%', // Adjusting the input width
        fontSize: 16,
        color: '#4A2C2A',
        borderWidth: 1,
        borderColor: '#8B5E3C',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    button: {
        backgroundColor: '#8B5E3C',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginBottom: 15,
        width: '100%', // Full width for the button
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        textAlign: 'center',
    },
    buttonCancel: {
        backgroundColor: '#D2A679',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        width: '100%', // Full width for the cancel button
    },
    subtitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4A2C2A',
        marginBottom: 15,
        textAlign: 'left', // Left-aligning the subtitle
    },
});

export default EditProfileScreen;