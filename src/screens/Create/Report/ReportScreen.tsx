import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Animated, StyleSheet, Modal, FlatList, TouchableWithoutFeedback } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const languages = ["Русский", "Кыргызский", "Казахский", "Узбекский", "Английский"];
const courses = ["1 курс", "2 курс", "3 курс", "4 курс", "Магистратура"];
const specialties = ["Юриспруденция", "Экономика", "Математика", "Физика", "Информатика"];
const subjects = ["Математика", "Физика", "Информатика", "История", "Биология"];
const reportTypes = ["Отчёт по практике", "Лабораторная работа", "Исследовательский отчёт"];

const ReportScreen = ({ navigation }) => {
    const [newSpeciality, setNewSpeciality] = useState('');
    const [newSubject, setNewSubject] = useState('');
    const [newLanguage, setNewLanguage] = useState('');
    const [newCourse, setNewCourse] = useState('');
    const [newReportType, setNewReportType] = useState('');

    const [selectedCategory, setSelectedCategory] = useState({
        speciality: '',
        course: '',
        language: '',
        subject: '',
        reportType: ''
    });
    const [modalVisible, setModalVisible] = useState({
        speciality: false,
        course: false,
        language: false,
        subject: false,
        reportType: false
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
        if (key === 'reportType') {
            setSelectedCategory({ ...selectedCategory, [key]: selectedValue });
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

    const addNewReportType = () => {
        if (newReportType) {
            reportTypes.push(newReportType);
            setNewReportType('');
        }
    };

    return (
        <LinearGradient colors={['#F4E7D4', '#D2A679']} style={styles.background}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Animated.View style={{ ...styles.container, opacity: fadeAnim }}>
                    <Text style={styles.bigText}>Создание отчета</Text>

                    {['speciality', 'subject', 'course', 'language', 'reportType'].map((key) => (
                        <TouchableOpacity key={key} style={styles.dropdown} onPress={() => openModal(key)}>
                            <Text style={styles.dropdownText}>
                                {selectedCategory[key] ||
                                    (key === 'speciality' ? 'Выберите специальность' :
                                        key === 'subject' ? 'Выберите предмет' :
                                            key === 'course' ? 'Выберите курс' :
                                                key === 'language' ? 'Выберите язык' :
                                                    key === 'reportType' ? 'Выберите тип отчёта' : 'Выберите')}
                            </Text>
                        </TouchableOpacity>
                    ))}
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
                                                    key === 'reportType' ? reportTypes : []}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity style={styles.modalItem} onPress={() => selectOption(key, item)}>
                                            <Text style={styles.modalText}>{item.title || item}</Text>
                                        </TouchableOpacity>
                                    )}
                                    style={styles.modalList}
                                />

                                
                                    (key === 'speciality' || key === 'subject' || key === 'language' || key === 'course' || key === 'reportType') && (
                                        <View style={styles.inputContainer}>
                                            <TextInput
                                                style={styles.input}
                                                placeholder={`Добавить ${key === 'speciality' ? 'специальность' :
                                                    key === 'subject' ? 'предмет' :
                                                        key === 'language' ? 'язык' :
                                                            key === 'course' ? 'курс' : 'тип отчёта'}`}
                                                value={key === 'speciality' ? newSpeciality :
                                                    key === 'subject' ? newSubject :
                                                        key === 'language' ? newLanguage :
                                                            key === 'course' ? newCourse : newReportType}
                                                onChangeText={key === 'speciality' ? setNewSpeciality :
                                                    key === 'subject' ? setNewSubject :
                                                        key === 'language' ? setNewLanguage :
                                                            key === 'course' ? setNewCourse : setNewReportType}
                                                placeholderTextColor="#888"
                                            />
                                            <TouchableOpacity style={styles.saveButton} onPress={() => {
                                                if (key === 'speciality') addNewSpeciality();
                                                if (key === 'subject') addNewSubject();
                                                if (key === 'language') addNewLanguage();
                                                if (key === 'course') addNewCourse();
                                                if (key === 'reportType') addNewReportType();
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
    buttonText: { color: '#5A3E2B', fontSize: 16, fontWeight: 'bold' },
    modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContainer: { backgroundColor: '#FFF', padding: 15, borderRadius: 10, width: '90%', alignItems: 'center' },
    modalItem: { padding: 15, marginVertical: 5, borderBottomWidth: 1, borderBottomColor: '#DDD', width: '100%', alignItems: 'center' },
    modalText: { fontSize: 16, color: '#5A3E2B' },
    inputContainer: { width: '90%', marginBottom: 20, alignSelf: 'center' },
    modalList: { maxHeight: 300 },
});

export default ReportScreen;
