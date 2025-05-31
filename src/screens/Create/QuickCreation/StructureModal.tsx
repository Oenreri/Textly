import React, { useEffect, useState } from 'react';
import {
    Modal, View, Text, TouchableOpacity, StyleSheet,
    TextInput, Animated, Dimensions, Easing, ActivityIndicator
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { generateStructure } from './generateStructureAI';
import Icon from 'react-native-vector-icons/Feather'; // Импортируем иконки
import Toast from 'react-native-toast-message'; // Импортируем Toast

const { width: screenWidth } = Dimensions.get('window');

const StructureModal = ({ visible, hide, structure, setStructure, topic, language, workType, speciality }) => {
    const [fadeAnim] = useState(new Animated.Value(0));
    const [loading, setLoading] = useState(false); // Состояние для загрузки

    useEffect(() => {
        if (visible) {
            fadeAnim.setValue(0);
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 200,
                easing: Easing.in(Easing.ease),
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    const generateStructureHandler = async () => {
        setLoading(true); // Включаем индикатор загрузки

        try {
            const newStructure = await generateStructure(topic, language, setStructure, workType, speciality );

            if (newStructure.length > 0) {
                setStructure(newStructure);
            } else {
                // Используем кастомный Toast
                Toast.show({
                    type: 'error',
                    position: 'bottom',
                    text1: 'Ошибка',
                    text2: 'Введите тему работы.',
                    visibilityTime: 3000,
                    autoHide: true,
                });
            }
        } catch (error) {
            console.error("Ошибка генерации структуры:", error);
            // Используем кастомный Toast для ошибки
            Toast.show({
                type: 'error',
                position: 'bottom',
                text1: 'Ошибка',
                text2: 'Ошибка при генерации структуры.',
                visibilityTime: 3000,
                autoHide: true,
            });
        } finally {
            setLoading(false); // Отключаем индикатор загрузки
        }
    };

    return (
        <Modal visible={visible} animationType="none" transparent>
            <View style={styles.modalContainer}>
                <Animated.View style={[styles.modalContent, { opacity: fadeAnim }]}>
                    <Text style={styles.modalTitle}>Структура работы</Text>
                    <Text style={styles.topicText}>Тема: {topic}</Text>
                    <Text style={styles.topicText}>Тип работы: {workType}</Text>
                    <KeyboardAwareScrollView
                        keyboardShouldPersistTaps="handled"
                        extraScrollHeight={20}
                        enableOnAndroid={true}
                        contentContainerStyle={{ paddingBottom: 20, width: screenWidth * 0.9 }}
                    >
                        {structure.map((item, index) => (
                            <View key={index} style={styles.sectionContainer}>
                                <View style={styles.sectionHeader}>
                                    <TextInput
                                        style={styles.sectionTitle}
                                        value={item.title}
                                        placeholder="Введите название раздела"
                                        placeholderTextColor="#B88A66"
                                        multiline
                                        onChangeText={(text) =>
                                            setStructure(prev =>
                                                prev.map((s, i) => (i === index ? { ...s, title: text } : s))
                                            )
                                        }
                                    />
                                    <TouchableOpacity
                                        style={styles.removeSectionButton}
                                        onPress={() =>
                                            setStructure(prev => prev.filter((_, i) => i !== index))
                                        }
                                    >
                                        <Text style={styles.removeButtonText}>Удалить</Text>
                                    </TouchableOpacity>
                                </View>

                                {item.subSections.map((subItem, subIndex) => (
                                    <View key={subIndex} style={styles.subSectionContainer}>
                                        <TextInput
                                            style={styles.subInput}
                                            value={subItem.title}
                                            placeholder="Название подраздела"
                                            multiline
                                            onChangeText={(text) =>
                                                setStructure(prev =>
                                                    prev.map((s, i) =>
                                                        i === index
                                                            ? {
                                                                ...s,
                                                                subSections: s.subSections.map((sub, j) =>
                                                                    j === subIndex ? { ...sub, title: text } : sub
                                                                ),
                                                            }
                                                            : s
                                                    )
                                                )
                                            }
                                        />
                                        <TouchableOpacity
                                            style={styles.removeButton}
                                            onPress={() =>
                                                setStructure(prev =>
                                                    prev.map((s, i) =>
                                                        i === index
                                                            ? {
                                                                ...s,
                                                                subSections: s.subSections.filter((_, j) => j !== subIndex)
                                                            }
                                                            : s
                                                    )
                                                )
                                            }
                                        >
                                            <Text style={styles.removeButtonText}>Удалить</Text>
                                        </TouchableOpacity>
                                    </View>
                                ))}

                                <TouchableOpacity
                                    style={styles.addButton}
                                    onPress={() =>
                                        setStructure(prev =>
                                            prev.map((s, i) =>
                                                i === index
                                                    ? { ...s, subSections: [...s.subSections, { title: 'Новый подраздел' }] }
                                                    : s
                                            )
                                        )
                                    }
                                >
                                    <Text style={styles.addButtonText}>Добавить подраздел</Text>
                                </TouchableOpacity>
                            </View>
                        ))}

                    </KeyboardAwareScrollView>

                    <TouchableOpacity style={styles.generateButton} onPress={generateStructureHandler}>
                        {loading ? (
                            <ActivityIndicator size="small" color="#FFF" />
                        ) : (
                            <Text style={styles.generateButtonText}>Автоматически создать структуру</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.addSectionButton} onPress={() => {
                        setStructure(prev => [...prev, { title: '', subSections: [] }]);
                    }}>
                        <Text style={styles.addSectionButtonText}>Добавить раздел</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.closeButton} onPress={hide}>
                        <Text style={styles.closeButtonText}>Закрыть</Text>
                    </TouchableOpacity>

                    
                    <TouchableOpacity
                        style={styles.clearStructureButton}
                        onPress={() => setStructure([])}
                    >
                        <Icon name="trash-2" size={30} color="#8B4513" />
                    </TouchableOpacity>
                </Animated.View>
            </View>
           
            <Toast />
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContent: { backgroundColor: '#FFF', padding: 20, borderRadius: 10, width: '100%', maxHeight: '80%', alignItems: 'center' },
    modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, color: '#5A3E2B' },
    topicText: { fontSize: 16, marginBottom: 10, color: '#8B4513', fontStyle: 'italic' },
    sectionContainer: { width: '100%', marginBottom: 15, padding: 10, backgroundColor: '#E1C4A9', borderRadius: 5 },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', flex: 1, paddingVertical: 5, paddingHorizontal: 5, borderBottomWidth: 1, borderColor: '#8B4513' },
    subSectionContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    subInput: { flex: 1, padding: 8, borderWidth: 1, borderColor: '#8B4513', borderRadius: 5, backgroundColor: '#FFF' },
    addButton: { backgroundColor: '#6F4F28', padding: 10, borderRadius: 5, marginVertical: 10 },
    addButtonText: { color: '#FFF', fontSize: 16 },
    removeButton: { marginLeft: 10, padding: 5, backgroundColor: '#FF6347', borderRadius: 5 },
    removeButtonText: { color: 'white', fontSize: 12 },
    removeSectionButton: { padding: 5, backgroundColor: '#FF4500', borderRadius: 5 },
    generateButton: { backgroundColor: '#E1C4A9', padding: 10, borderRadius: 5, marginVertical: 10 },
    generateButtonText: { color: '#5A3E2B', fontSize: 16 },
    addSectionButton: { backgroundColor: '#E1C4A9', padding: 10, borderRadius: 5, marginVertical: 10 },
    addSectionButtonText: { color: '#5A3E2B', fontSize: 16 },
    closeButton: { marginTop: 10 },
    closeButtonText: { color: '#5A3E2B', fontSize: 16 },
    clearStructureButton: { position: 'absolute', bottom: 10, right: 10, backgroundColor: '#D2A679', padding: 10, borderRadius: 30 }
});


export default StructureModal;
