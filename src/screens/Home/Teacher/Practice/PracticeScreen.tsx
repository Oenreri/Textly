import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, TextInput, Animated, Modal, FlatList, ScrollView, TouchableWithoutFeedback } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styles from './StylePractice';  // Import the styles here

const languages = ["Русский", "Кыргызский", "Казахский", "Узбекский", "Английский"];
const specialties = ["Юриспруденция", "Экономика", "Менеджмент", "Математика"];
const subjects = ["Алгебра", "Геометрия", "Программирование", "Биология"];
const taskTypes = ["Аналитическое", "Ситуационное", "Исследовательское", "Научное"];
const difficultyLevels = ["Начальный", "Средний", "Продвинутый"];

const PracticeScreen = ({ navigation }) => {
    const [selectedCategory, setSelectedCategory] = useState({
        speciality: '',
        subject: '',
        language: '',
        topic: '',
        taskCount: '',
        taskType: '',
        difficulty: '',
        comment: ''  // Новое поле для комментариев
    });
    const [modalVisible, setModalVisible] = useState({
        speciality: false,
        subject: false,
        language: false,
        taskType: false,
        difficulty: false
    });
    const [title, setTitle] = useState('');
    const [newSpeciality, setNewSpeciality] = useState('');
    const [newSubject, setNewSubject] = useState('');
    const [newLanguage, setNewLanguage] = useState('');
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

    const handleSave = () => {
        alert('Задание сохранено!');
    };

    const addNewSpeciality = () => {
        if (newSpeciality.trim()) {
            specialties.push(newSpeciality);
            setSelectedCategory({ ...selectedCategory, speciality: newSpeciality });
            setNewSpeciality('');
            closeModal('speciality');
        }
    };

    const addNewSubject = () => {
        if (newSubject.trim()) {
            subjects.push(newSubject);
            setSelectedCategory({ ...selectedCategory, subject: newSubject });
            setNewSubject('');
            closeModal('subject');
        }
    };

    const addNewLanguage = () => {
        if (newLanguage.trim()) {
            languages.push(newLanguage);
            setSelectedCategory({ ...selectedCategory, language: newLanguage });
            setNewLanguage('');
            closeModal('language');
        }
    };

    return (
        <LinearGradient colors={['#F4E7D4', '#D2A679']} style={styles.background}>
            <View contentContainerStyle={styles.scrollContainer}>
                <Animated.View style={{ ...styles.container, opacity: fadeAnim }}>
                    <Text style={styles.bigText}>Практические задания</Text>

                    {['speciality', 'subject', 'language', 'taskType', 'difficulty'].map((key) => (
                        <TouchableOpacity key={key} style={styles.dropdown} onPress={() => openModal(key)}>
                            <Text style={styles.dropdownText}>
                                {selectedCategory[key] ||
                                    (key === 'speciality' ? 'Выберите специальность' :
                                        key === 'subject' ? 'Выберите предмет' :
                                            key === 'language' ? 'Выберите язык' :
                                                key === 'taskType' ? 'Выберите тип задания' :
                                                    key === 'difficulty' ? 'Выберите сложность' : 'Выберите')}
                            </Text>
                        </TouchableOpacity>
                    ))}

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Тема"
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
                            placeholder="Введите количество задач"
                            keyboardType="numeric"
                            value={selectedCategory.taskCount}
                            onChangeText={(text) => setSelectedCategory({ ...selectedCategory, taskCount: text })}
                            placeholderTextColor="#888"
                        />
                    </View>

                    {/* Новое поле для комментариев */}
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Комментарий (по желанию)"
                            value={selectedCategory.comment}
                            onChangeText={(text) => setSelectedCategory({ ...selectedCategory, comment: text })}
                            placeholderTextColor="#888"
                            multiline
                            textAlign="left"
                        />
                    </View>

                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.buttonText}>Создать задание</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>

            {Object.keys(modalVisible).map((key) => (
                <Modal key={key} visible={modalVisible[key]} transparent animationType="slide" onRequestClose={() => closeModal(key)}>
                    <TouchableWithoutFeedback onPress={() => closeModal(key)}>
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContainer}>
                                {key === 'speciality' || key === 'subject' ? (
                                    <ScrollView style={styles.scrollableModal}>
                                        {(key === 'speciality' ? specialties : subjects).map((item, index) => (
                                            <TouchableOpacity key={index} style={styles.modalItem} onPress={() => selectOption(key, item)}>
                                                <Text style={styles.modalText}>{item}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                ) : (
                                    <FlatList
                                        data={key === 'language' ? languages :
                                            key === 'taskType' ? taskTypes :
                                                key === 'difficulty' ? difficultyLevels : []}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity style={styles.modalItem} onPress={() => selectOption(key, item)}>
                                                <Text style={styles.modalText}>{item}</Text>
                                            </TouchableOpacity>
                                        )}
                                        style={styles.modalFlatList}
                                    />
                                )}

                                {key === 'speciality' && (
                                    <View style={styles.addItemContainer}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Добавить новую специальность"
                                            value={newSpeciality}
                                            onChangeText={setNewSpeciality}
                                            placeholderTextColor="#888"
                                        />
                                        <TouchableOpacity style={styles.addButton} onPress={addNewSpeciality}>
                                            <Text style={styles.buttonText}>Добавить</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}

                                {key === 'subject' && (
                                    <View style={styles.addItemContainer}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Добавить новый предмет"
                                            value={newSubject}
                                            onChangeText={setNewSubject}
                                            placeholderTextColor="#888"
                                        />
                                        <TouchableOpacity style={styles.addButton} onPress={addNewSubject}>
                                            <Text style={styles.buttonText}>Добавить</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}

                                {key === 'language' && (
                                    <View style={styles.addItemContainer}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Добавить новый язык"
                                            value={newLanguage}
                                            onChangeText={setNewLanguage}
                                            placeholderTextColor="#888"
                                        />
                                        <TouchableOpacity style={styles.addButton} onPress={addNewLanguage}>
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

export default PracticeScreen;
