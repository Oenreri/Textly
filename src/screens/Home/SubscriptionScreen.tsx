import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Animated, Easing, ToastAndroid } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '../../../src/screens/Home/UserContext';
import { db } from './firebaseConfig';
import { ref, set } from 'firebase/database';

export const plans = [
    { id: 'free', title: 'Бесплатная', description: '1 работа бесплатно из "Быстрой работы"', icon: 'lock', price: 'Бесплатно' },
    { id: '3day', title: 'Подписка на 3 дня', description: 'Доступ к быстрому созданию', icon: 'flash-on', price: '599 сом' },
    { id: '2week', title: 'Подписка на 2 недели', description: 'Доступ к быстрому созданию', icon: 'event', price: '1499 сом' },
    { id: 'diploma', title: 'Дипломная работа на 2 дня', description: 'Для дипломных работ, диссертаций и СПО', icon: 'school', price: '3200 сом' },
    { id: 'full', title: 'Подписка на месяц', description: 'Доступ ко всем видам работ на месяц', icon: 'star', price: '7599 сом' },
    { id: '3month', title: 'Подписка на три месяца', description: 'Доступ ко всем видам работ на три месяца', icon: 'stars', price: '9999 сом' }
];

const SubscriptionScreen = ({ navigation }) => {
    const { user, updateUser } = useUser();
    const [activePlan, setActivePlan] = useState(user?.subscription || 'free');
    const [expiryDate, setExpiryDate] = useState(user?.subscriptionExpiry ? new Date(user.subscriptionExpiry) : null);
    const fadeAnim = useState(new Animated.Value(0))[0];
    const scaleAnim = useState(new Animated.Value(1))[0];

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, [user]);

    useEffect(() => {
        const checkSubscription = async () => {
            const storedUser = await AsyncStorage.getItem('user');
            if (!storedUser) return;

            const userData = JSON.parse(storedUser);
            if (!userData.subscriptionExpiry) return;

            const now = new Date();
            const expiryDate = new Date(userData.subscriptionExpiry);

            setExpiryDate(expiryDate);

            if (now >= expiryDate) {
                const updatedUser = { ...userData, subscription: 'free', subscriptionExpiry: null };
                await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
                updateUser(updatedUser);
                ToastAndroid.show('Срок подписки истёк, переключено на Бесплатная', ToastAndroid.LONG);
                setExpiryDate(null);
            }
        };
        checkSubscription();
    }, []);

    const switchSubscription = async (planId) => {
    const selectedPlan = plans.find(plan => plan.id === planId);
    const now = new Date();
    let newExpiryDate = new Date(now);

    if (planId === '3day') newExpiryDate.setDate(now.getDate() + 3);
    if (planId === '2week') newExpiryDate.setDate(now.getDate() + 14);
    if (planId === 'diploma') newExpiryDate.setDate(now.getDate() + 2);
    if (planId === 'full') newExpiryDate.setMonth(now.getMonth() + 1);
    if (planId === '3month') newExpiryDate.setMonth(now.getMonth() + 3);

    if (planId === 'free') {
        Alert.alert(
            'Смена подписки',
            `Вы уверены, что хотите переключиться на бесплатный план?`,
            [
                { text: 'Отмена', style: 'cancel' },
                {
                    text: 'Сменить', onPress: async () => {
                        Animated.sequence([
                            Animated.timing(scaleAnim, {
                                toValue: 1.1,
                                duration: 200,
                                easing: Easing.ease,
                                useNativeDriver: true,
                            }),
                            Animated.timing(scaleAnim, {
                                toValue: 1,
                                duration: 200,
                                easing: Easing.ease,
                                useNativeDriver: true,
                            })
                        ]).start();

                        const updatedUser = { ...user, subscription: 'free', subscriptionExpiry: null };
                        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
                        updateUser(updatedUser);
                        setActivePlan('free');
                        setExpiryDate(null);
                        ToastAndroid.show('Подписка успешно изменена!', ToastAndroid.LONG);
                    }
                }
            ]
        );
    } else {
        // Платные подписки — показать алерт с телеграмом
        Alert.alert(
            'Обновление подписки',
            'Напишите по телеграмму @Textly_dev — для обновления подписки',
            [{ text: 'OK' }]
        );
    }
};

    return (
        <LinearGradient colors={['#6A0DAD', '#3B3B3B']} style={styles.background}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Подписка</Text>
                <View style={styles.subscriptionDetails}>
                    <Text style={styles.detailsLabel}>Текущая подписка:</Text>
                    <Text style={styles.detailsText}>{plans.find(p => p.id === activePlan)?.title}</Text>
                    {expiryDate && <Text style={styles.detailsText}>Действует до: {expiryDate.toLocaleDateString()}</Text>}
                </View>
                {plans.map((plan) => (
                    <Animated.View key={plan.id} style={[styles.planContainer, { opacity: fadeAnim, transform: [{ scale: activePlan === plan.id ? scaleAnim : 1 }], borderWidth: activePlan === plan.id ? 3 : 0, borderColor: activePlan === plan.id ? '#FFD700' : 'transparent', backgroundColor: activePlan === plan.id ? '#7B3F00' : '#4B0082' }]} >
                        <Icon name={plan.icon} size={30} color="white" style={styles.icon} />
                        <Text style={styles.planTitle}>{plan.title}</Text>
                        <Text style={styles.planDescription}>{plan.description}</Text>
                        <Text style={styles.planPrice}>{plan.price}</Text>
                        <TouchableOpacity style={styles.button} onPress={() => switchSubscription(plan.id)}>
                            <Animated.Text style={[styles.buttonText, { transform: [{ scale: fadeAnim }] }]}>
                                {activePlan === plan.id ? 'Активна' : 'Сменить'}
                            </Animated.Text>
                        </TouchableOpacity>
                    </Animated.View>
                ))}
            </ScrollView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    background: { flex: 1 },
    container: { alignItems: 'center', padding: 20 },
    title: { fontSize: 26, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
    subscriptionDetails: { marginBottom: 20, padding: 15, borderRadius: 10, backgroundColor: '#4B0082', alignItems: 'center', width: '90%' },
    detailsLabel: { fontSize: 18, color: '#FFD700', fontWeight: 'bold' },
    detailsText: { fontSize: 20, color: '#fff', fontWeight: 'bold', marginTop: 5 },
    planContainer: { width: '90%', padding: 20, marginVertical: 10, borderRadius: 10, alignItems: 'center' },
    icon: { marginBottom: 10 },
    planTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
    planDescription: { fontSize: 16, color: '#ddd', textAlign: 'center', marginVertical: 5 },
    planPrice: { fontSize: 18, color: '#fff', fontWeight: 'bold', marginBottom: 10 },
    button: { paddingVertical: 12, paddingHorizontal: 25, borderRadius: 10, backgroundColor: '#FFD700', marginTop: 10 },
    buttonText: { fontSize: 18, fontWeight: 'bold', color: '#4B0082' }
});

export default SubscriptionScreen;
