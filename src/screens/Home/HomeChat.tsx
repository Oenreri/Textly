import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';
import { GEMINI_API_KEY } from '@env';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Создание модели Gemini
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: { temperature: 0.5, maxOutputTokens: 4096 },
});

const HomeChat = ({ navigation }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { role: 'user', text: input };
        setMessages([...messages, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await model.generateContent(input);
            const botReply = response.response.text();

            setMessages([...messages, userMessage, { role: 'bot', text: botReply }]);
        } catch (error) {
            console.error('Ошибка AI:', error);
            setMessages([...messages, { role: 'bot', text: 'Ошибка при получении ответа. Попробуйте позже.' }]);
        }

        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.chatBox}>
                {messages.map((msg, index) => (
                    <View key={index} style={msg.role === 'user' ? styles.userMsg : styles.botMsg}>
                        <Text style={styles.msgText}>{msg.text}</Text>
                    </View>
                ))}
            </ScrollView>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={input}
                    onChangeText={setInput}
                    placeholder="Напишите сообщение..."
                />
                <TouchableOpacity onPress={sendMessage} style={styles.sendButton} disabled={loading}>
                    <Icon name="send" size={24} color="#FFF" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F4E7D4', padding: 10 },
    chatBox: { flex: 1 },
    userMsg: { alignSelf: 'flex-end', backgroundColor: '#D2A679', padding: 10, borderRadius: 10, marginVertical: 5 },
    botMsg: { alignSelf: 'flex-start', backgroundColor: '#E1C4A9', padding: 10, borderRadius: 10, marginVertical: 5 },
    msgText: { color: '#5A3E2B', fontSize: 16 },
    inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 10 },
    input: { flex: 1, backgroundColor: '#FFF', padding: 10, borderRadius: 10, marginRight: 10 },
    sendButton: { backgroundColor: '#C8A27C', padding: 10, borderRadius: 10 },
});

export default HomeChat;
