import React, { useState } from 'react';
import { TouchableOpacity, Text, View, FlatList, Modal, TextInput, TouchableWithoutFeedback } from 'react-native';
import styles from './StyleDiploma';

const languages = ["Русский", "Кыргызский", "Казахский", "Узбекский", "Английский"];
const specialties = ["Юриспруденция", "Экономика"];
const subjects = ["Математика", "Физика", "Информатика"];
const workTypes = ["Дипломная работа", "Выпускная квалификационная работа", "Бакалаврская работа", "Магистерская диссертация", "Дипломный проект (СПО)"];
const researchTypes = ["Теоретическая работа", "Практическая работа (прикладное исследование)", "Проектная работа", "Исследовательская работа"];

const ModalComponent = ({ selectedCategory, setSelectedCategory }) => {
    const [newSpeciality, setNewSpeciality] = useState('');
    const [newSubject, setNewSubject] = useState('');
    const [newLanguage, setNewLanguage] = useState('');
    const [newResearchType, setNewResearchType] = useState('');
    const [modalVisible, setModalVisible] = useState({
        speciality: false,
        language: false,
        subject: false,
        workType: false,
        researchType: false
    });

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

    const addNewResearchType = () => {
        if (newResearchType) {
            researchTypes.push(newResearchType);
            setNewResearchType('');
        }
    };

    return (
        <>
            {['speciality', 'subject', 'language', 'workType', 'researchType'].map((key) => (
                <TouchableOpacity key={key} style={styles.dropdown} onPress={() => openModal(key)}>
                    <Text style={styles.dropdownText}>
                        {selectedCategory[key] ||
                            (key === 'speciality' ? 'Выберите специальность' :
                                key === 'subject' ? 'Выберите предмет' :
                                    key === 'language' ? 'Выберите язык' :
                                        key === 'workType' ? 'Выберите тип работы' :
                                            key === 'researchType' ? 'Выберите характер исследования' : '')}
                    </Text>
                </TouchableOpacity>
            ))}

            {Object.keys(modalVisible).map((key) => (
                <Modal key={key} visible={modalVisible[key]} transparent animationType="slide" onRequestClose={() => closeModal(key)}>
                    <TouchableWithoutFeedback onPress={() => closeModal(key)}>
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContainer}>
                                <FlatList
                                    data={key === 'language' ? languages :
                                        key === 'speciality' ? specialties :
                                            key === 'subject' ? subjects :
                                                key === 'workType' ? workTypes :
                                                    key === 'researchType' ? researchTypes : []}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity style={styles.modalItem} onPress={() => selectOption(key, item)}>
                                            <Text style={styles.modalText}>{item.title || item}</Text>
                                        </TouchableOpacity>
                                    )}
                                    style={styles.modalList}
                                />

                                {(key === 'speciality' || key === 'subject' || key === 'language' || key === 'researchType') && (
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder={`Добавить ${key === 'speciality' ? 'специальность' :
                                                key === 'subject' ? 'предмет' :
                                                    key === 'language' ? 'язык' :
                                                        key === 'researchType' ? 'характер исследования' : ''}`}
                                            value={key === 'speciality' ? newSpeciality :
                                                key === 'subject' ? newSubject :
                                                    key === 'language' ? newLanguage :
                                                        key === 'researchType' ? newResearchType : ''}
                                            onChangeText={key === 'speciality' ? setNewSpeciality :
                                                key === 'subject' ? setNewSubject :
                                                    key === 'language' ? setNewLanguage :
                                                        key === 'researchType' ? setNewResearchType : null}
                                            placeholderTextColor="#888"
                                        />
                                        <TouchableOpacity style={styles.saveButton} onPress={() => {
                                            if (key === 'speciality') addNewSpeciality();
                                            if (key === 'subject') addNewSubject();
                                            if (key === 'language') addNewLanguage();
                                            if (key === 'researchType') addNewResearchType();
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
        </>
    );
};

export default ModalComponent;
