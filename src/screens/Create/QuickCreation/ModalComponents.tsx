import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, FlatList, Alert, TouchableWithoutFeedback } from 'react-native';
import styles from './StyleQuick';

const ModalComponents = ({ modalVisible, setModalVisible, selectedCategory, setSelectedCategory }) => {
    const [languages, setLanguages] = useState(["Русский", "Кыргызский", "Казахский", "Узбекский", "Английский"]);
    const [courses, setCourses] = useState(["Колледж", "Университет","Магистратура"]);
    const [specialties, setSpecialties] = useState(["Юриспруденция", "Экономика"]);
    const [workTypes, setWorkTypes] = useState(["Реферат", "Курсовая работа", "СРС", "Эссе"]);

    const [newSpeciality, setNewSpeciality] = useState('');
    const [newLanguage, setNewLanguage] = useState('');
    const [newCourse, setNewCourse] = useState('');

    const openModal = (key) => {
        setModalVisible(prevState => ({ ...prevState, [key]: true }));
    };

    const closeModal = (key) => {
        setModalVisible(prevState => ({ ...prevState, [key]: false }));
    };

    const selectOption = (key, value) => {
        setSelectedCategory(prevState => ({ ...prevState, [key]: value }));
        closeModal(key);
    };

    const addNewItem = (key) => {
        if (key === 'speciality' && newSpeciality) {
            setSpecialties([...specialties, newSpeciality]);
            setNewSpeciality('');
        }
        if (key === 'language' && newLanguage) {
            setLanguages([...languages, newLanguage]);
            setNewLanguage('');
        }
        if (key === 'course' && newCourse) {
            setCourses([...courses, newCourse]);
            setNewCourse('');
        }
    };

    const removeItem = (key, item) => {
        Alert.alert(
            "Удаление",
            `Вы уверены, что хотите удалить "${item}"?`,
            [
                { text: "Отмена", style: "cancel" },
                {
                    text: "Удалить",
                    onPress: () => {
                        if (key === 'speciality') {
                            setSpecialties(specialties.filter(s => s !== item));
                        }
                        if (key === 'language') {
                            setLanguages(languages.filter(l => l !== item));
                        }
                        if (key === 'course') {
                            setCourses(courses.filter(c => c !== item));
                        }
                    },
                    style: "destructive"
                }
            ]
        );
    };

    return (
        <>
            {Object.keys(modalVisible).map((key) => (
                <Modal key={key} visible={modalVisible[key]} transparent animationType="slide" onRequestClose={() => closeModal(key)}>
                    <TouchableWithoutFeedback onPress={() => closeModal(key)}>
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContainer}>
                                <FlatList
                                    data={key === 'language' ? languages :
                                        key === 'course' ? courses :
                                            key === 'speciality' ? specialties :
                                                key === 'workType' ? workTypes : []}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            style={styles.modalItem}
                                            onPress={() => selectOption(key, item)}
                                            onLongPress={() => removeItem(key, item)}
                                        >
                                            <Text style={styles.modalText}>{item}</Text>
                                        </TouchableOpacity>
                                    )}
                                    style={styles.modalList}
                                />

                                {(key === 'speciality' || key === 'language' || key === 'course') && (
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder={`Добавить ${key === 'speciality' ? 'специальность' :
                                                key === 'language' ? 'язык' : 'курс'}`}
                                            value={key === 'speciality' ? newSpeciality :
                                                key === 'language' ? newLanguage : newCourse}
                                            onChangeText={key === 'speciality' ? setNewSpeciality :
                                                key === 'language' ? setNewLanguage : setNewCourse}
                                            placeholderTextColor="#888"
                                        />
                                        <TouchableOpacity style={styles.saveButton} onPress={() => addNewItem(key)}>
                                            <Text style={styles.buttonText}>Добавить</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            ))}
        </>
    );
};

export default ModalComponents;
