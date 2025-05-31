import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Animated, StyleSheet, BackHandler, Modal, FlatList, TouchableWithoutFeedback, Switch } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { lectureMethods, lectureTypes, writingStyles } from './LectureOptions';

const languages = ["Русский", "Кыргызский", "Казахский", "Узбекский", "Английский"];
const courses = ["1 курс", "2 курс", "3 курс", "4 курс", "Магистратура"];
const specialties = ["Юриспруденция", "Экономика", "Математика", "Физика", "Информатика"];
const subjects = ["Математика", "Физика", "Информатика", "История", "Биология"];
const formats = ["Текстовый"];

const LectureScreen = ({ navigation }) => {
    const [selectedCategory, setSelectedCategory] = useState({
        speciality: '',
        course: '',
        format: '',
        language: '',
        method: '',
        type: '',
        style: '',
        subject: ''
    });
    const [modalVisible, setModalVisible] = useState({
        speciality: false,
        course: false,
        format: false,
        language: false,
        method: false,
        type: false,
        style: false,
        subject: false
    });
    const [title, setTitle] = useState('');
    const [duration, setDuration] = useState('');
    const [pages, setPages] = useState('');
    const [description, setDescription] = useState('');
    const [discussionQuestions, setDiscussionQuestions] = useState(false);
    const [testQuestions, setTestQuestions] = useState(false);
    const [cases, setCases] = useState(false);
    const [newSpeciality, setNewSpeciality] = useState('');
    const [newSubject, setNewSubject] = useState('');
    const [newLanguage, setNewLanguage] = useState('');
    const [newCourse, setNewCourse] = useState('');
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, []);

    useEffect(() => {
        const backAction = () => {
            navigation.goBack();
            return true;
        };
        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
        return () => backHandler.remove();
    }, []);

    const handleSave = () => {
        alert('Лекция сохранена!');
    };

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
                    <Text style={styles.bigText}>Создание лекций</Text>

                    {['speciality', 'subject', 'course', 'format', 'language', 'method', 'type', 'style'].map((key) => (
                        <TouchableOpacity key={key} style={styles.dropdown} onPress={() => openModal(key)}>
                            <Text style={styles.dropdownText}>
                                {selectedCategory[key] ||
                                    (key === 'speciality' ? 'Выберите специальность' :
                                        key === 'subject' ? 'Выберите предмет' :
                                            key === 'course' ? 'Выберите курс' :
                                                key === 'format' ? 'Выберите формат' :
                                                    key === 'language' ? 'Выберите язык' :
                                                        key === 'method' ? 'Выберите метод' :
                                                            key === 'type' ? 'Выберите тип' :
                                                                key === 'style' ? 'Выберите стиль' : 'Выберите')}
                            </Text>
                        </TouchableOpacity>
                    ))}

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Название лекции"
                            value={title}
                            onChangeText={setTitle}
                            placeholderTextColor="#888"
                            multiline
                            textAlign="left"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Продолжительность (минуты)"
                            keyboardType="numeric"
                            value={duration}
                            onChangeText={setDuration}
                            multiline
                            placeholderTextColor="#888"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Количество страниц"
                            keyboardType="numeric"
                            value={pages}
                            onChangeText={setPages}
                            multiline
                            placeholderTextColor="#888"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.textArea}
                            placeholder="Описание лекции"
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            placeholderTextColor="#888"
                            textAlign="left"
                            textAlignVertical="top"
                        />
                    </View>

                    {/* Переключатели */}
                    {[
                        ['Вопросы для обсуждения', discussionQuestions, setDiscussionQuestions],
                        ['Тест/контрольные вопросы', testQuestions, setTestQuestions],
                        ['Примеры и кейсы', cases, setCases]
                    ].map(([label, state, setState]) => (
                        <View key={label} style={styles.switchContainer}>
                            <Text style={styles.switchLabel}>{label}</Text>
                            <Switch value={state} onValueChange={setState} />
                        </View>
                    ))}

                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.buttonText}>Создать лекцию</Text>
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
                                                    key === 'format' ? formats :
                                                        key === 'method' ? lectureMethods :
                                                            key === 'type' ? lectureTypes :
                                                                key === 'style' ? writingStyles : []}
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
    textArea: { backgroundColor: '#FFF', padding: 10, borderRadius: 8, borderColor: '#5A3E2B', borderWidth: 1, width: '90%', height: 120, marginBottom: 10 },
    saveButton: { backgroundColor: '#E1C4A9', padding: 15, borderRadius: 10, width: '90%', alignItems: 'center' },
    buttonText: { color: '#5A3E2B', fontSize: 16, fontWeight: 'bold' },
    modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContainer: { backgroundColor: '#FFF', padding: 15, borderRadius: 10, width: '90%', alignItems: 'center' },
    modalItem: { padding: 15, marginVertical: 5, borderBottomWidth: 1, borderBottomColor: '#DDD', width: '100%', alignItems: 'center' },
    modalText: { fontSize: 16, color: '#5A3E2B' },
    switchContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    switchLabel: { color: '#5A3E2B', fontSize: 16, marginRight: 10 },
    inputContainer: { width: '90%', marginBottom: 20, alignSelf: 'center' },
    modalList: { maxHeight: 300 },
});

export default LectureScreen;
