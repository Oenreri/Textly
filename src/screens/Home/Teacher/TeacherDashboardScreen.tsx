import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, BackHandler } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const TeacherDashboardScreen = ({ navigation }) => {
    const [selectedOption, setSelectedOption] = useState(null);

    const options = [
        { title: 'Создание лекций', value: 'Lecture' },
        { title: 'Практические задания', value: 'Practice' },
        { title: 'Экзаменационные билеты', value: 'Exam' },
        { title: 'Тесты', value: 'Quiz' },
        { title: 'Раздаточные материалы', value: 'Handout' },
        { title: 'Планы занятий', value: 'LessonPlan' }
    ];

    useEffect(() => {
        const backAction = () => {
            if (selectedOption) {
                setSelectedOption(null);
                return true; // Предотвращаем выход с экрана
            }
            return false; // Позволяем выйти из экрана
        };

        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
        return () => backHandler.remove();
    }, [selectedOption]);

    const handleOptionPress = (value) => {
        const screenName = `${value}Screen`; // Формируем имя экрана (например, 'LectureScreen')
        navigation.navigate(screenName); // Переход на нужный экран
    };

    return (
        <LinearGradient colors={['#F4E7D4', '#D2A679']} style={styles.background}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.logoContainer}>
                    <Text style={styles.bigText}>Преподавательский кабинет</Text>
                    {selectedOption && <Text style={styles.subtitle}>Настройка параметров</Text>}
                </View>

                {!selectedOption ? (
                    <View style={styles.optionList}>
                        {options.map((option, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.optionButton}
                                onPress={() => handleOptionPress(option.value)}
                            >
                                <Text style={styles.optionText}>{option.title}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                ) : (
                    <View style={styles.settingsContainer}>
                        
                    </View>
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
        flexGrow: 1,
        justifyContent: 'space-between',
    },
    logoContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bigText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#5A3E2B',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#5A3E2B',
        marginTop: 5,
        textAlign: 'center',
    },
    optionList: {
        width: '90%',
        alignItems: 'center',
        marginTop: 20,
    },
    optionButton: {
        backgroundColor: '#E1C4A9',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 10,
        width: '100%',
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    optionText: {
        color: '#5A3E2B',
        fontSize: 16,
        fontWeight: 'bold',
    },
    settingsContainer: {
        width: '90%',
        padding: 20,
        backgroundColor: '#E1C4A9',
        borderRadius: 10,
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
});

export default TeacherDashboardScreen;
