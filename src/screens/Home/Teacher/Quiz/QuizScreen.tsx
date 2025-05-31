import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Animated, StyleSheet, Modal, FlatList, TouchableWithoutFeedback, Switch } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styles from './StyleQuiz';


const languages = ["Русский", "Кыргызский", "Казахский", "Узбекский", "Английский"];
const courses = ["1 курс", "2 курс", "3 курс", "4 курс", "Магистратура"];
const specialties = ["Юриспруденция", "Экономика", "Математика", "Физика", "Информатика"];
const subjects = ["Математика", "Физика", "Информатика", "История", "Биология"];
const testTypes = ["Ситуационные", "Аналитические", "Исследовательские", "Научные"];
const questionTypes = [
    "Вопросы с выбором ответа",
    "Открытые вопросы",
    "Соответствие",
    "Последовательность",
    "Заполнение пропусков"
];
const difficultyLevels = ["Легкий", "Средний", "Сложный"]; // Уровни сложности

const QuizScreen = ({ navigation }) => {
    const [newSpeciality, setNewSpeciality] = useState('');
    const [newSubject, setNewSubject] = useState('');
    const [newLanguage, setNewLanguage] = useState('');
    const [newCourse, setNewCourse] = useState('');
    const [newTestType, setNewTestType] = useState('');
    const [newQuestionType, setNewQuestionType] = useState('');
    const [newDifficultyLevel, setNewDifficultyLevel] = useState(''); // Состояние для уровня сложности
    const [title, setTitle] = useState(''); // Состояние для темы
    const [numQuestions, setNumQuestions] = useState(''); // Состояние для количества вопросов
    const [numTests, setNumTests] = useState(''); // Состояние для количества тестов
    const [tipsEnabled, setTipsEnabled] = useState(false); // Состояние для переключателя подсказок

    const [selectedCategory, setSelectedCategory] = useState({
        speciality: '',
        course: '',
        language: '',
        subject: '',
        testType: '',
        questionType: '',
        difficultyLevel: '' // Новый элемент для уровня сложности
    });
    const [modalVisible, setModalVisible] = useState({
        speciality: false,
        course: false,
        language: false,
        subject: false,
        testType: false,
        questionType: false,
        difficultyLevel: false // Модальное окно для уровня сложности
    });

    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, []);

    const openModal = (key) => {
        setModalVisible(prevState => ({ ...prevState, [key]: true }));
    };

    const closeModal = (key) => {
        setModalVisible(prevState => ({ ...prevState, [key]: false }));
    };

    const selectOption = (key, value) => {
        const selectedValue = value.title || value;
        setSelectedCategory({ ...selectedCategory, [key]: selectedValue });
        closeModal(key);
    };

    const addNewSpeciality = () => {
        if (newSpeciality) {
            specialties.push(newSpeciality);
            setNewSpeciality('');
        }
    };

    const addNewSubject = () => {
        if (newSubject) {
            subjects.push(newSubject);
            setNewSubject('');
        }
    };

    const addNewLanguage = () => {
        if (newLanguage) {
            languages.push(newLanguage);
            setNewLanguage('');
        }
    };

    const addNewCourse = () => {
        if (newCourse) {
            courses.push(newCourse);
            setNewCourse('');
        }
    };

    const addNewTestType = () => {
        if (newTestType) {
            testTypes.push(newTestType);
            setNewTestType('');
        }
    };

    const addNewQuestionType = () => {
        if (newQuestionType) {
            questionTypes.push(newQuestionType);
            setNewQuestionType('');
        }
    };

    const addNewDifficultyLevel = () => { // Функция для добавления нового уровня сложности
        if (newDifficultyLevel) {
            difficultyLevels.push(newDifficultyLevel);
            setNewDifficultyLevel('');
        }
    };

    const createTest = () => {
        // Логика для создания теста
        console.log("Тесты созданы");
    };

    return (
        <LinearGradient colors={['#F4E7D4', '#D2A679']} style={styles.background}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Animated.View style={{ ...styles.container, opacity: fadeAnim }}>
                    <Text style={styles.bigText}>Создание тестов</Text>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Тема (конкретная тема в рамках предмета)"
                            value={title}
                            onChangeText={setTitle}
                            placeholderTextColor="#888"
                            multiline
                            textAlign="left"
                        />
                    </View>

                    {['speciality', 'subject', 'course', 'language', 'testType', 'questionType', 'difficultyLevel'].map((key) => (
                        <TouchableOpacity key={key} style={styles.dropdown} onPress={() => openModal(key)}>
                            <Text style={styles.dropdownText}>
                                {selectedCategory[key] ||
                                    (key === 'speciality' ? 'Выберите специальность' :
                                        key === 'subject' ? 'Выберите предмет' :
                                            key === 'course' ? 'Выберите курс' :
                                                key === 'language' ? 'Выберите язык' :
                                                    key === 'testType' ? 'Выберите тип теста' :
                                                        key === 'questionType' ? 'Выберите тип вопроса' :
                                                            key === 'difficultyLevel' ? 'Выберите уровень сложности' : 'Выберите')}
                            </Text>
                        </TouchableOpacity>
                    ))}

                    {/* Перемещено поле для количества тестов и количества вопросов выше */}
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Количество тестов"
                            value={numTests}
                            onChangeText={setNumTests}
                            keyboardType="numeric"
                            placeholderTextColor="#888"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Количество вопросов в одном тесте"
                            value={numQuestions}
                            onChangeText={setNumQuestions}
                            keyboardType="numeric"
                            placeholderTextColor="#888"
                        />
                    </View>
                </Animated.View>

          
                <View style={styles.switchContainer}>
                    <Text style={styles.switchLabel}>Подсказки к вопросам</Text>
                    <Switch
                        value={tipsEnabled}
                        onValueChange={setTipsEnabled}
                        thumbColor="#5A3E2B"
                        trackColor={{ false: "#E1C4A9", true: "#D2A679" }}
                    />
                </View>

               
                <View style={{ width: '100%', alignItems: 'center', marginTop: 20 }}>
                    <TouchableOpacity style={styles.createButton} onPress={createTest}>
                        <Text style={styles.createButtonText}>Создать тест</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {Object.keys(modalVisible).map((key) => (
                <Modal key={key} visible={modalVisible[key]} transparent animationType="slide" onRequestClose={() => closeModal(key)}>
                    <TouchableWithoutFeedback onPress={() => closeModal(key)}>
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContainer}>
                                <FlatList
                                    data={key === 'language' ? languages :
                                        key === 'course' ? courses :
                                            key === 'speciality' ? specialties :
                                                key === 'subject' ? subjects :
                                                    key === 'testType' ? testTypes :
                                                        key === 'questionType' ? questionTypes :
                                                            key === 'difficultyLevel' ? difficultyLevels : []}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity style={styles.modalItem} onPress={() => selectOption(key, item)}>
                                            <Text style={styles.modalText}>{item.title || item}</Text>
                                        </TouchableOpacity>
                                    )}
                                    style={styles.modalFlatList}
                                    keyboardShouldPersistTaps="handled"
                                />

                                {(key === 'speciality' || key === 'subject' || key === 'language' || key === 'course' || key === 'testType' || key === 'questionType' || key === 'difficultyLevel') && (
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder={`Добавить ${key === 'speciality' ? 'специальность' :
                                                key === 'subject' ? 'предмет' :
                                                    key === 'language' ? 'язык' :
                                                        key === 'course' ? 'курс' :
                                                            key === 'testType' ? 'тип теста' :
                                                                key === 'questionType' ? 'тип вопроса' : 'уровень сложности'}`}
                                            value={key === 'speciality' ? newSpeciality :
                                                key === 'subject' ? newSubject :
                                                    key === 'language' ? newLanguage :
                                                        key === 'course' ? newCourse :
                                                            key === 'testType' ? newTestType :
                                                                key === 'questionType' ? newQuestionType : newDifficultyLevel}
                                            onChangeText={key === 'speciality' ? setNewSpeciality :
                                                key === 'subject' ? setNewSubject :
                                                    key === 'language' ? setNewLanguage :
                                                        key === 'course' ? setNewCourse :
                                                            key === 'testType' ? setNewTestType :
                                                                key === 'questionType' ? setNewQuestionType : setNewDifficultyLevel}
                                            placeholderTextColor="#888"
                                        />
                                        <TouchableOpacity style={styles.saveButton} onPress={() => {
                                            if (key === 'speciality') addNewSpeciality();
                                            if (key === 'subject') addNewSubject();
                                            if (key === 'language') addNewLanguage();
                                            if (key === 'course') addNewCourse();
                                            if (key === 'testType') addNewTestType();
                                            if (key === 'questionType') addNewQuestionType();
                                            if (key === 'difficultyLevel') addNewDifficultyLevel();
                                        }}>
                                            <Text style={styles.buttonText}>Добавить</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>




            ))}
        </LinearGradient>
    );
};


export default QuizScreen;
