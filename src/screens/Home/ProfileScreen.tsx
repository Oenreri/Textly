import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useUser } from './UserContext';
import { signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { auth } from './firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'react-native-image-picker';
import { useAvatar } from './AvatarContext';

const ProfileScreen = () => {
    const { user, login, logout, updateSubscription } = useUser();
    const navigation = useNavigation();
    const { avatar, setAvatar } = useAvatar();
    const subscriptionTitles = {
        'free': 'Бесплатная',
        '3day': 'Трехдневная',
        '2week': ' на 2 недели',
        'diploma': 'Дипломная работа на 2 дня',
        'full': ' на месяц',
        '3month': 'Трехмесячная',
    };

    const userSubscription = user?.subscription || 'none';
    const subscriptionTitle = subscriptionTitles[userSubscription] || 'Нет подписки';
    useEffect(() => {
        const loadUserData = async () => {
            const storedData = await AsyncStorage.getItem('user');
            if (storedData) {
                const parsedData = JSON.parse(storedData);
                if (!user || user.email !== parsedData.email) {
                    login(parsedData);
                }
            }
        };

        const loadAvatar = async () => {
            const storedAvatar = await AsyncStorage.getItem('userAvatar');
            if (storedAvatar && storedAvatar !== avatar) {
                setAvatar(storedAvatar);
            }
        };

        loadUserData();
        loadAvatar();
    }, [user]);

    const pickImage = () => {
        ImagePicker.launchImageLibrary({ mediaType: 'photo' }, async (response) => {
            if (response.didCancel) return;
            if (response.error) {
                Alert.alert('Ошибка', 'Не удалось выбрать изображение.');
                return;
            }
            const imageUri = response.assets[0].uri;
            setAvatar(imageUri);
            await AsyncStorage.setItem('userAvatar', imageUri);
        });
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            await AsyncStorage.removeItem('user');
            logout();
            navigation.replace('Auth');
        } catch (error) {
            console.error(error);
            Alert.alert('Ошибка', 'Не удалось выйти из аккаунта. ' + error.message);
        }
    };

    const handleEditProfile = () => {
        navigation.navigate('EditProfile');
    };

    const handleGenerationSettings = () => {
        navigation.navigate('GenerationSettingsScreen');
    };

    const handlePaymentMethods = () => {
        navigation.navigate('PaymentMethods');
    };

    const handleSubscribe = () => {
        navigation.navigate('Subscription');
    };

    const handleSupport = () => {
        navigation.navigate('SupportScreen');
    };

    return (
        <LinearGradient colors={['#F4E7D4', '#D2A679']} style={styles.background}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Профиль</Text>

                {user && user.email ? (
                    <>
                        <View style={styles.infoContainer}>
                            <TouchableOpacity onPress={pickImage}>
                                {avatar ? (
                                    <Image source={{ uri: avatar }} style={styles.profileIcon} />
                                ) : (
                                    <Icon name="person" size={80} color="#333" style={styles.profileIcon} />
                                )}
                            </TouchableOpacity>
                            <Text style={styles.infoText}>
                                {user.name || 'Не указано'} {user.surname ? user.surname : 'Не указана'}
                            </Text>

                            <Text style={styles.infoText}>Email: {user.email}</Text>
                            <Text style={styles.infoText}>Подписка: {subscriptionTitle}</Text>
                        </View>


                        <TouchableOpacity style={styles.button} onPress={handleEditProfile}>
                            <Icon name="edit" size={20} color="#fff" style={styles.icon} />
                            <Text style={styles.buttonText}>Редактировать профиль</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.button} onPress={handleGenerationSettings}>
                            <Icon name="tune" size={20} color="#fff" style={styles.icon} />
                            <Text style={styles.buttonText}>Настройки генерации</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.button} onPress={handlePaymentMethods}>
                            <Icon name="payment" size={20} color="#fff" style={styles.icon} />
                            <Text style={styles.buttonText}>Способы оплаты</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.button} onPress={handleSubscribe}>
                            <Icon name="star" size={20} color="#fff" style={styles.icon} />
                            <Text style={styles.buttonText}>
                                {user.subscription ? 'Управление подпиской' : 'Оформить подписку'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.button} onPress={handleSupport}>
                            <Icon name="support-agent" size={20} color="#fff" style={styles.icon} />
                            <Text style={styles.buttonText}>Связаться с поддержкой</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.buttonLogout} onPress={handleLogout}>
                            <Icon name="exit-to-app" size={20} color="#FFF8DC" style={styles.icon} />
                            <Text style={styles.buttonText}>Выйти</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <TouchableOpacity style={styles.button} onPress={() => navigation.replace('Auth')}>
                        <Text style={styles.buttonText}>Войти</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </LinearGradient>
    );
};


const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    container: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center'
    },
    infoContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profileIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 10,
    },
    infoText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#8B4513',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 10,
        width: '80%',
        marginBottom: 10,
    },
    buttonLogout: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#D9534F',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 10,
        width: '80%',
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    icon: {
        marginRight: 10,
    },
});

export default ProfileScreen;
