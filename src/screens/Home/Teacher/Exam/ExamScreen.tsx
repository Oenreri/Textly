import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Animated, StyleSheet, Modal, FlatList, TouchableWithoutFeedback, Switch } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const languages = ["Русский", "Кыргызский", "Казахский", "Узбекский", "Английский"];
const courses = ["1 курс", "2 курс", "3 курс", "4 курс", "Магистратура"];
const specialties = ["Юриспруденция", "Экономика", "Математика", "Физика", "Информатика"];
const subjects = ["Математика", "Физика", "Информатика", "История", "Биология"];
const questionTypes = ["Открытые", "Тестовые", "Ситуационные", "Смешанные"];
const difficultyLevels = ["Начальный", "Средний", "Сложный"];

const ExamScreen = ({ navigation }) => {
    const [newSpeciality, setNewSpeciality] = useState('');
    const [newSubject, setNewSubject] = useState('');
    const [newLanguage, setNewLanguage] = useState('');
    const [newCourse, setNewCourse] = useState('');
    const [title, setTitle] = useState('');
    const [ticketCount, setTicketCount] = useState('');
    const [questionCount, setQuestionCount] = useState('');
    const [selectedQuestionType, setSelectedQuestionType] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState('');
    const [createWithAnswers, setCreateWithAnswers] = useState(false); // Новый стейт для переключателя

    const [selectedCategory, setSelectedCategory] = useState({
        speciality: '',
        course: '',
        language: '',
        subject: ''
    });
    const [modalVisible, setModalVisible] = useState({
        speciality: false,
        course: false,
        language: false,
        subject: false,
        questionType: false,
        difficulty: false
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
        if (key === 'questionType') {
            setSelectedQuestionType(selectedValue);
        } else if (key === 'difficulty') {
            setSelectedDifficulty(selectedValue);
        } else {
            setSelectedCategory({ ...selectedCategory, [key]: selectedValue });
        }
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

    const handleCreateTickets = () => {
        // Your logic to create tickets, you can display an alert for now
        console.log('Билеты созданы!');
        // Example: show an alert
        alert('Билеты успешно созданы!');
    };

    return (
        <LinearGradient colors={['#F4E7D4', '#D2A679']} style={styles.background}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Animated.View style={{ ...styles.container, opacity: fadeAnim }}>
                    <Text style={styles.bigText}>Экзаменационные билеты</Text>

                    {['speciality', 'subject', 'course', 'language'].map((key) => (
                        <TouchableOpacity key={key} style={styles.dropdown} onPress={() => openModal(key)}>
                            <Text style={styles.dropdownText}>
                                {selectedCategory[key] ||
                                    (key === 'speciality' ? 'Выберите специальность' :
                                        key === 'subject' ? 'Выберите предмет' :
                                            key === 'course' ? 'Выберите курс' :
                                                key === 'language' ? 'Выберите язык' : 'Выберите')}
                            </Text>
                        </TouchableOpacity>
                    ))}

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Тема экзаменационного билета"
                            value={title}
                            onChangeText={setTitle}
                            placeholderTextColor="#888"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Количество билетов"
                            keyboardType="numeric"
                            value={ticketCount}
                            onChangeText={setTicketCount}
                            placeholderTextColor="#888"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Количество вопросов в билете"
                            keyboardType="numeric"
                            value={questionCount}
                            onChangeText={setQuestionCount}
                            placeholderTextColor="#888"
                        />
                    </View>

                    <TouchableOpacity style={styles.dropdown} onPress={() => openModal('questionType')}>
                        <Text style={styles.dropdownText}>
                            {selectedQuestionType || 'Выберите тип вопросов'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.dropdown} onPress={() => openModal('difficulty')}>
                        <Text style={styles.dropdownText}>
                            {selectedDifficulty || 'Выберите сложность вопросов'}
                        </Text>
                    </TouchableOpacity>

                    {/* Переключатель для "Создать билеты с ответами" */}
                    <View style={styles.switchContainer}>
                        <Text style={styles.switchText}>Создать билеты с ответами</Text>
                        <Switch
                            value={createWithAnswers}
                            onValueChange={setCreateWithAnswers}
                            trackColor={{ false: "#767577", true: "#81b0ff" }}
                            thumbColor={createWithAnswers ? "#f5dd4b" : "#f4f3f4"}
                        />
                    </View>

                    {/* Create Tickets Button */}
                    <TouchableOpacity style={styles.createButton} onPress={handleCreateTickets}>
                        <Text style={styles.buttonText}>Создать билеты</Text>
                    </TouchableOpacity>

                </Animated.View>
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
                                                    key === 'questionType' ? questionTypes :
                                                        key === 'difficulty' ? difficultyLevels : []}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity style={styles.modalItem} onPress={() => selectOption(key, item)}>
                                            <Text style={styles.modalText}>{item.title || item}</Text>
                                        </TouchableOpacity>
                                    )}
                                    style={styles.modalList}
                                />

                                { // New item input container, only for certain keys
                                    (key === 'speciality' || key === 'subject' || key === 'language' || key === 'course') && (
                                        <View style={styles.inputContainer}>
                                            <TextInput
                                                style={styles.input}
                                                placeholder={`Добавить ${key === 'speciality' ? 'специальность' :
                                                    key === 'subject' ? 'предмет' :
                                                        key === 'language' ? 'язык' : 'курс'}`}
                                                value={key === 'speciality' ? newSpeciality :
                                                    key === 'subject' ? newSubject :
                                                        key === 'language' ? newLanguage : newCourse}
                                                onChangeText={key === 'speciality' ? setNewSpeciality :
                                                    key === 'subject' ? setNewSubject :
                                                        key === 'language' ? setNewLanguage : setNewCourse}
                                                placeholderTextColor="#888"
                                            />
                                            <TouchableOpacity style={styles.saveButton} onPress={() => {
                                                if (key === 'speciality') addNewSpeciality();
                                                if (key === 'subject') addNewSubject();
                                                if (key === 'language') addNewLanguage();
                                                if (key === 'course') addNewCourse();
                                            }}>
                                                <Text style={styles.buttonText}>Добавить</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )
                                }
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            ))}
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    background: { flex: 1 },
    container: { alignItems: 'center', paddingVertical: 20, flexGrow: 1, justifyContent: 'center' },
    bigText: { fontSize: 24, fontWeight: 'bold', color: '#5A3E2B', textAlign: 'center', marginBottom: 20 },
    dropdown: { backgroundColor: '#E1C4A9', padding: 15, borderRadius: 8, marginBottom: 10, width: '90%', alignItems: 'center' },
    dropdownText: { color: '#5A3E2B', fontSize: 16 },
    input: { backgroundColor: '#FFF', padding: 10, borderRadius: 8, borderColor: '#5A3E2B', borderWidth: 1, width: '90%', marginBottom: 10 },
    saveButton: { backgroundColor: '#E1C4A9', padding: 15, borderRadius: 10, width: '90%', alignItems: 'center' },
    createButton: { backgroundColor: '#5A3E2B', padding: 15, borderRadius: 10, width: '90%', alignItems: 'center', marginTop: 20 },
    buttonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
    inputContainer: { width: '90%' },
    switchContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 15 },
    switchText: { fontSize: 16, color: '#5A3E2B', marginRight: 10 },
    modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContainer: { backgroundColor: '#FFF', padding: 15, borderRadius: 10, width: '90%', alignItems: 'center' },
    modalItem: { padding: 15, marginVertical: 5, borderBottomWidth: 1, borderBottomColor: '#DDD', width: '100%', alignItems: 'center' },
    modalText: { fontSize: 16, color: '#5A3E2B' },
    modalList: { maxHeight: 300 },
    modalFlatList: {
        maxHeight: 300,
        width: '100%',
    },
    scrollableModal: {
        maxHeight: 300,
        width: '100%',
    },
});

export default ExamScreen;
