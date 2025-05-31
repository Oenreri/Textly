// InputFields.js
import React from 'react';
import { TextInput, Text, TouchableOpacity } from 'react-native';
import styles from './StyleDiploma';  // Make sure the styles are imported correctly

const InputFields = ({
    workTopic,
    setWorkTopic,
    numPages,
    setNumPages,
    requirements,
    setRequirements,
    suggestions,
    setSuggestions,
    onStructurePress,
    onCreatePress
}) => {
    return (
        <>
            <TextInput
                style={styles.input}
                placeholder="Тема работы"
                value={workTopic}
                multiline
                onChangeText={setWorkTopic}
                placeholderTextColor="#888"
            />
            <TextInput
                style={styles.input}
                placeholder="Количество страниц"
                value={numPages}
                multiline
                onChangeText={setNumPages}
                keyboardType="numeric"
                placeholderTextColor="#888"
            />
            <TouchableOpacity
                style={styles.button}
                onPress={onStructurePress}
            >
                <Text style={styles.buttonText}>Структура работы</Text>
            </TouchableOpacity>

            <TextInput
                style={styles.input}
                placeholder="Требования к работе"
                value={requirements}
                multiline
                onChangeText={setRequirements}
                placeholderTextColor="#888"
            />
            <TextInput
                style={styles.input}
                placeholder="Пожелания к работе"
                value={suggestions}
                multiline
                onChangeText={setSuggestions}
                placeholderTextColor="#888"
            />

            <TouchableOpacity style={styles.createButton} onPress={onCreatePress}>
                <Text style={styles.buttonText}>Создать</Text>
            </TouchableOpacity>
        </>
    );
};

export default InputFields;
