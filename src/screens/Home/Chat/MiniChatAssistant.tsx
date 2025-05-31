import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './StyleChat';
import { GEMINI_API_KEY } from '@env';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { auth, rtdb } from '../../../screens/Home/firebaseConfig';
import { ref, get } from 'firebase/database';
import { sendMessageHandler } from './chatHelpers';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const STORAGE_KEY = 'chat_messages';

const MiniChatAssistant = ({ isVisible, toggleChat }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const chatRef = useRef(null);
    const flatListRef = useRef(null);
    const [user, setUser] = useState(null);
    const [subscription, setSubscription] = useState(null);
    const [showCustomAlert, setShowCustomAlert] = useState(false);
    const navigation = useNavigation();

    const sendMessage = () => {
        sendMessageHandler({
            input,
            user,
            subscription, // передаем информацию о подписке
            messages,
            setMessages,
            setInput,
            setLoading,
            chatRef,
            navigation,
            setShowCustomAlert,
        });
    };
 

    useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
        if (currentUser) {
            setUser(currentUser);
            try {
                const userRef = ref(rtdb, 'users/' + currentUser.uid);
                const snapshot = await get(userRef);
                if (snapshot.exists()) {
                    let data = snapshot.val();
                    const userName = currentUser.displayName || 'друг';  // Используем displayName
                    setSubscription(data?.subscription || 'free');

                    const welcome = {
                        id: '1',
                        role: 'model',
                        text: `Привет, ${userName}! Я ассистент Textly. Чем могу помочь?`,
                    };

                    // Проверяем, есть ли сохраненные сообщения в AsyncStorage
                    const stored = await AsyncStorage.getItem(STORAGE_KEY);
                    const storedMessages = stored ? JSON.parse(stored) : [];
                    // Если сообщений нет, добавляем приветственное
                    if (storedMessages.length === 0) {
                        storedMessages.push(welcome);
                    }
                    setMessages(storedMessages);  // Обновляем сообщения
                } else {
                    setMessages([{
                        id: '1',
                        role: 'model',
                        text: `Привет, друг! Я ассистент Textly. Чем могу помочь?`,
                    }]);
                }
            } catch (error) {
                console.error('Ошибка при получении данных пользователя из rtdb:', error);
            }
        } else {
            setUser(null);
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            if (stored) {
                setMessages(JSON.parse(stored));
            } else {
                setMessages([{
                    id: '1',
                    role: 'model',
                    text: `Привет, друг! Я ассистент Textly. Чем могу помочь?`,
                }]);
            }
        }
    });

    return unsubscribe;
}, []);

// Очищаем чат с выводом имени пользователя
const clearChat = async () => {
    const welcome = {
        id: '1',
        role: 'model',
        text: `Привет, ${user?.displayName || 'друг'}! Я ассистент Textly. Чем могу помочь?`,
    };
    setMessages([welcome]);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([welcome]));
    chatRef.current = null;
};

// В render-части
{messages.map((item) => (
    <View
        key={item.id}
        style={item.role === 'user' ? styles.userMessage : styles.assistantMessage}
    >
        <Text style={styles.messageText}>{item.text}</Text>
    </View>
))}



    useEffect(() => {
        if (flatListRef.current && messages.length > 0) {
            flatListRef.current.scrollToEnd({ animated: true });
        }
    }, [messages]);

    if (!isVisible) return null;

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.chatContainer}
        >
            <View style={styles.chatHeader}>
                <Text style={styles.headerText}>Чат с ассистентом</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity onPress={clearChat} style={{ marginRight: 12 }}>
                        <Icon name="delete-forever" size={24} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={toggleChat}>
                        <Icon name="close" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                ref={flatListRef}
                keyboardShouldPersistTaps="handled"
                style={styles.messagesList}
                contentContainerStyle={{ paddingBottom: 10 }}
            >
                {messages.map((item) => (
                    <View
                        key={item.id}
                        style={item.role === 'user' ? styles.userMessage : styles.assistantMessage}
                    >
                        <Text style={styles.messageText}>{item.text}</Text>
                    </View>
                ))}
            </ScrollView>

            {loading && <ActivityIndicator size="small" color="#4B7BE5" style={{ marginBottom: 10 }} />}

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Задай вопрос..."
                    placeholderTextColor="#999"
                    value={input}
                    multiline
                    onChangeText={setInput}
                    onSubmitEditing={sendMessage}
                    returnKeyType="send"
                />
                <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
                    <Text style={styles.sendButtonText}>Отпр.</Text>
                </TouchableOpacity>
            </View>

            {showCustomAlert && (
                <View style={styles.customAlertOverlay}>
                    <View style={styles.customAlertBox}>
                        <Text style={styles.customAlertTitle}>Требуется авторизация</Text>
                        <Text style={styles.customAlertMessage}>
                            Чтобы продолжить использовать ассистента, войдите в аккаунт.
                        </Text>
                        <View style={styles.customAlertButtons}>
                            <TouchableOpacity
                                style={styles.alertButton}
                                onPress={() => {
                                    setShowCustomAlert(false);
                                    navigation.navigate('Auth');
                                }}
                            >
                                <Text style={styles.alertButtonText}>Перейти</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.alertButton, { backgroundColor: '#ccc' }]}
                                onPress={() => setShowCustomAlert(false)}
                            >
                                <Text style={styles.alertButtonText}>Отмена</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
        </KeyboardAvoidingView>
    );
};

export default MiniChatAssistant;
