import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Animated, StyleSheet, Modal, FlatList, TouchableWithoutFeedback } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const languages = ["Русский", "Кыргызский", "Казахский", "Узбекский", "Английский"];
const courses = ["1 курс", "2 курс", "3 курс", "4 курс", "Магистратура"];
const specialties = ["Юриспруденция", "Экономика", "Математика", "Физика", "Информатика"];
const subjects = ["Математика", "Физика", "Информатика", "История", "Биология"];
const presentationTypes = ["Обзорная", "Исследовательская", "Учебная", "Мотивационная"];
const formats = ["С текстом", "С тезисами", "С изображениями", "Инфографика"];
const difficulties = ["Начальный", "Средний", "Продвинутый"];

const PresentationScreen = ({ navigation }) => {
    const [newSpeciality, setNewSpeciality] = useState('');
    const [newSubject, setNewSubject] = useState('');
    const [newLanguage, setNewLanguage] = useState('');
    const [newCourse, setNewCourse] = useState('');
    const [topic, setTopic] = useState('');
    const [slidesCount, setSlidesCount] = useState('');

    const [selectedCategory, setSelectedCategory] = useState({
        speciality: '',
        course: '',
        language: '',
        subject: '',
        type: '',
        format: '',
        difficulty: ''
    });
    const [modalVisible, setModalVisible] = useState({
        speciality: false,
        course: false,
        language: false,
        subject: false,
        type: false,
        format: false,
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

    return (
        <LinearGradient colors={['#F4E7D4', '#D2A679']} style={styles.background}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Animated.View style={{ ...styles.container, opacity: fadeAnim }}>
                    <Text style={styles.bigText}>Создать презентацию</Text>

                    {['speciality', 'subject', 'course', 'language', 'type', 'format', 'difficulty'].map((key) => (
                        <TouchableOpacity key={key} style={styles.dropdown} onPress={() => openModal(key)}>
                            <Text style={styles.dropdownText}>
                                {selectedCategory[key] ||
                                    (key === 'speciality' ? 'Выберите специальность' :
                                        key === 'subject' ? 'Выберите предмет' :
                                            key === 'course' ? 'Выберите курс' :
                                                key === 'language' ? 'Выберите язык' :
                                                    key === 'type' ? 'Тип презентации' :
                                                        key === 'format' ? 'Формат подачи' :
                                                            key === 'difficulty' ? 'Уровень сложности' : 'Выберите')}
                            </Text>
                        </TouchableOpacity>
                    ))}

                    <TextInput
                        style={styles.input}
                        placeholder="Тема презентации"
                        placeholderTextColor="#888"
                        value={topic}
                        onChangeText={setTopic}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Количество слайдов"
                        placeholderTextColor="#888"
                        keyboardType="numeric"
                        value={slidesCount}
                        onChangeText={setSlidesCount}
                    />

                    <TouchableOpacity style={styles.saveButton}>
                        <Text style={styles.buttonText}>Создать презентацию</Text>
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
                                                    key === 'type' ? presentationTypes :
                                                        key === 'format' ? formats :
                                                            key === 'difficulty' ? difficulties : []}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity style={styles.modalItem} onPress={() => selectOption(key, item)}>
                                            <Text style={styles.modalText}>{item.title || item}</Text>
                                        </TouchableOpacity>
                                    )}
                                    style={styles.modalList}
                                />

                                {(key === 'speciality' || key === 'subject' || key === 'language' || key === 'course') && (
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
                                )}
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
    scrollContainer: { flexGrow: 1 },
    container: { alignItems: 'center', paddingVertical: 20, flexGrow: 1, justifyContent: 'center' },
    bigText: { fontSize: 24, fontWeight: 'bold', color: '#5A3E2B', textAlign: 'center', marginBottom: 20 },
    dropdown: { backgroundColor: '#E1C4A9', padding: 15, borderRadius: 8, marginBottom: 10, width: '90%', alignItems: 'center' },
    dropdownText: { color: '#5A3E2B', fontSize: 16 },
    input: { backgroundColor: '#FFF', padding: 10, borderRadius: 8, borderColor: '#5A3E2B', borderWidth: 1, width: '90%', marginBottom: 10 },
    saveButton: { backgroundColor: '#E1C4A9', padding: 15, borderRadius: 10, width: '90%', alignItems: 'center', marginBottom: 15 },
    buttonText: { color: '#5A3E2B', fontSize: 16, fontWeight: 'bold' },
    modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContainer: { backgroundColor: '#FFF', padding: 15, borderRadius: 10, width: '90%', alignItems: 'center' },
    modalItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#E1C4A9', alignItems: 'center' },
    modalText: { fontSize: 16, color: '#5A3E2B' },
    inputContainer: { width: '90%', marginBottom: 5 },
    modalList: { maxHeight: 300 },
});

export default PresentationScreen;
