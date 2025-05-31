import React from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import styles from './StyleQuick';

const QuickCreationInputs = ({
    topic,
    setTopic,
    pages,
    setPages,
    requirements,
    setRequirements,
    comment,
    setComment,
    setStructureModalVisible,
    handleQuitWorkWithAI
}) => {
    return (
        <>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Введите название темы"
                    value={topic}
                    multiline
                    onChangeText={setTopic}
                    placeholderTextColor="#888"
                />
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Введите количество страниц"
                    value={pages}
                    onChangeText={setPages}
                    keyboardType="numeric"
                    placeholderTextColor="#888"
                />
            </View>

            {/* Кнопка "Настроить структуру" */}
            <TouchableOpacity style={styles.saveButton} onPress={() => setStructureModalVisible(true)}>
                <Text style={styles.buttonText}>Настроить структуру</Text>
            </TouchableOpacity>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Введите требования к работе"
                    value={requirements}
                    multiline
                    onChangeText={setRequirements}
                    placeholderTextColor="#888"
                />
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Комментарий к работе"
                    value={comment}
                    multiline
                    onChangeText={setComment}
                    placeholderTextColor="#888"
                />
            </View>

            {/* Кнопка "Создать работу" */}
            <TouchableOpacity style={styles.saveButton} onPress={handleQuitWorkWithAI}>
                <Text style={styles.buttonText}>Создать работу</Text>
            </TouchableOpacity>
        </>
    );
};

export default QuickCreationInputs;
