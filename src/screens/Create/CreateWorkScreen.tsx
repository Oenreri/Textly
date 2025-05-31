import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const CreateWorkScreen = ({ navigation }) => {
    const handleUnavailableFeature = () => {
        Alert.alert("🚀 Совсем скоро!", "Мы уже работаем над этим, скоро будет доступно!");
    };

    return (
        <LinearGradient colors={['#F4E7D4', '#D2A679']} style={styles.background}>
            <View style={styles.container}>
                <Text style={styles.title}>Студенческий кабинет</Text>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} activeOpacity={0.7} onPress={() => navigation.navigate('QuickCreation')}>
                        <Text style={styles.buttonText}>Быстрое создание</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} activeOpacity={0.7} onPress={() => navigation.navigate('DiplomaWork')}>
                        <Text style={styles.buttonText}>Дипломная работа</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.disabledButton} activeOpacity={0.7} onPress={handleUnavailableFeature}>
                        <Text style={styles.disabledButtonText}>Продвинутое создание</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.disabledButton} activeOpacity={0.7} onPress={handleUnavailableFeature}>
                        <Text style={styles.disabledButtonText}>Создать отчет</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.disabledButton} activeOpacity={0.7} onPress={handleUnavailableFeature}>
                        <Text style={styles.disabledButtonText}>Создать проект</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.disabledButton} activeOpacity={0.7} onPress={handleUnavailableFeature}>
                        <Text style={styles.disabledButtonText}>Создать слайдшоу</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} activeOpacity={0.7} onPress={() => navigation.navigate('Presentation')}>
                        <Text style={styles.buttonText}>Создать презентацию</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    background: { flex: 1 },
    container: { flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingVertical: 20 },
    title: { fontSize: 26, fontWeight: 'bold', color: '#5A3E2B', textAlign: 'center', marginBottom: 120 },
    buttonContainer: { width: '90%', marginBottom: 20 },
    button: { backgroundColor: '#6F4F28', paddingVertical: 15, borderRadius: 10, alignItems: 'center', marginBottom: 15 },
    buttonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
    disabledButton: { backgroundColor: '#A9A9A9', paddingVertical: 15, borderRadius: 10, alignItems: 'center', marginBottom: 15 },
    disabledButtonText: { color: '#E0E0E0', fontSize: 16, fontWeight: 'bold', textAlign: 'center' }
});

export default CreateWorkScreen;