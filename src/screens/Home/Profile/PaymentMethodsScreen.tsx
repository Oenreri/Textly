import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const PaymentMethodsScreen = () => {
    const navigation = useNavigation();
    const [paymentMethods, setPaymentMethods] = useState([]);

    useEffect(() => {
        loadPaymentMethods();
    }, []);

    const loadPaymentMethods = async () => {
        const storedMethods = await AsyncStorage.getItem('paymentMethods');
        if (storedMethods) {
            setPaymentMethods(JSON.parse(storedMethods));
        }
    };

    const addPaymentMethod = async () => {
        const newMethod = { id: Date.now(), type: 'Карта', number: '**** **** **** 1234' };

        const updatedMethods = [...paymentMethods, newMethod];
        setPaymentMethods(updatedMethods);
        await AsyncStorage.setItem('paymentMethods', JSON.stringify(updatedMethods));

        Alert.alert('Успех', 'Способ оплаты добавлен.');
    };

    const removePaymentMethod = async (id) => {
        const updatedMethods = paymentMethods.filter(method => method.id !== id);
        setPaymentMethods(updatedMethods);
        await AsyncStorage.setItem('paymentMethods', JSON.stringify(updatedMethods));

        Alert.alert('Удалено', 'Способ оплаты удалён.');
    };

    return (
        <LinearGradient colors={['#F4E7D4', '#D2A679']} style={styles.background}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Способы оплаты</Text>

                {paymentMethods.length > 0 ? (
                    paymentMethods.map((method) => (
                        <View key={method.id} style={styles.paymentItem}>
                            <Icon name="credit-card" size={24} color="#333" />
                            <Text style={styles.paymentText}>{method.type}: {method.number}</Text>
                            <TouchableOpacity onPress={() => removePaymentMethod(method.id)}>
                                <Icon name="delete" size={24} color="red" />
                            </TouchableOpacity>
                        </View>
                    ))
                ) : (
                    <Text style={styles.emptyText}>Нет сохранённых способов оплаты</Text>
                )}

                <TouchableOpacity style={styles.button} onPress={addPaymentMethod}>
                    <Icon name="add" size={20} color="#fff" style={styles.icon} />
                    <Text style={styles.buttonText}>Добавить способ оплаты</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonLogout} onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={20} color="#FFF8DC" style={styles.icon} />
                    <Text style={styles.buttonText}>Назад</Text>
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

export default PaymentMethodsScreen;
