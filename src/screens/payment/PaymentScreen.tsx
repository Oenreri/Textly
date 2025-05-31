import React, { useState, useEffect } from "react";
import { View, Text, Button, Alert, StyleSheet } from "react-native";
import { getOtp } from "../../../src/screens/payment/paymentApi";
import { useUser } from '../../../src/screens/Home/UserContext'; // Импортируем контекст пользователя
import { plans } from '../../../src/screens/Home/SubscriptionScreen'; // Импортируем массив планов подписки

const PaymentScreen = ({ route, navigation }) => {
    const { user } = useUser();
    const { planId } = route.params; // Получаем id плана подписки из параметров навигации
    const [selectedPlan, setSelectedPlan] = useState(null);

    useEffect(() => {
        const plan = plans.find((plan) => plan.id === planId);
        setSelectedPlan(plan);
    }, [planId]);

    const handleGetOtp = async () => {
        if (!selectedPlan) {
            Alert.alert("Ошибка", "План подписки не выбран.");
            return;
        }

        const response = await getOtp(selectedPlan.price); // Получаем OTP для соответствующего плана

        if (response) {
            console.log("Ответ от API:", response);
            Alert.alert("Ответ от банка", JSON.stringify(response, null, 2));
        } else {
            Alert.alert("Ошибка", "Не удалось получить OTP.");
        }
    };

    if (!selectedPlan) {
        return (
            <View style={styles.container}>
                <Text>Ошибка: план подписки не найден.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Платёж через банк</Text>
            <Text style={styles.planTitle}>Вы выбрали план: {selectedPlan.title}</Text>
            <Text style={styles.planDescription}>{selectedPlan.description}</Text>
            <Text style={styles.planPrice}>Стоимость: {selectedPlan.price}</Text>

            <Button title="Получить OTP-код" onPress={handleGetOtp} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    planTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    planDescription: {
        fontSize: 16,
        marginBottom: 10,
        textAlign: 'center',
    },
    planPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ff6347',
        marginBottom: 20,
    }
});

export default PaymentScreen;
