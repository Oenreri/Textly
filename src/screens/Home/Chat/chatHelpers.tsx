import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '@env';
import { Keyboard } from 'react-native';
import contextMessage from './assistantContext'; // Импортируем контекст

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const STORAGE_KEY = 'chat_messages';

export const sendMessageHandler = async ({
    input,
    user, // передаем данные о пользователе
    subscription,
    messages,
    setMessages,
    setInput,
    setLoading,
    chatRef,
    navigation,
    setShowCustomAlert,
}) => {
    if (!input.trim()) return;

    if (!user) {
        const userMessagesCount = messages.filter(m => m.role === 'user').length;
        if (userMessagesCount >= 5) {
            setShowCustomAlert(true); // показать кастомный алерт
            return;
        }
    }

    // Получаем имя пользователя, если оно доступно
    const userName = user && user.displayName ? user.displayName : 'друг'; // Если имя не задано, используем 'друг'

    const userMessage = { id: Date.now().toString(), role: 'user', text: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMessages));
    Keyboard.dismiss();

    try {
        if (!chatRef.current) {
            const model = genAI.getGenerativeModel({
                model: 'gemini-1.5-flash',
                generationConfig: { temperature: 0.7, maxOutputTokens: 256 },
            });

            chatRef.current = model.startChat({
                history: [
                    contextMessage,
                    ...updatedMessages.map((m) => ({
                        role: m.role === 'model' ? 'model' : 'user',
                        parts: [{ text: m.text }],
                    })),
                ],
            });
        }

        const result = await chatRef.current.sendMessage(input);
        const response = await result.response.text();
        let aiReplyText = response.trim();

        const lowerInput = input.toLowerCase();

        // Используем имя пользователя в ответе
        aiReplyText = aiReplyText.replace(/{{userName}}/g, userName);

        // Условие для ответа на "Как меня зовут?"
        if (lowerInput.includes('как меня зовут')) {
            aiReplyText = `Тебя зовут ${userName}!`;
        }

        // Проверка на "создание структуры" или "план" и запрет добавления структуры, если уже предложено использование кнопки
        if (lowerInput.includes('создай структуру') || lowerInput.includes('придумай план')) {
            aiReplyText = `Чтобы создать структуру, есть кнопка автоматически создать структуру, перейди в раздел "Быстрое создание" или "Дипломная работа".`;
        }

        // Убедимся, что после предложения "быстрое создание" не будет идти структура
        if (aiReplyText.includes("Чтобы создать структуру автоматически")) {
            aiReplyText = aiReplyText.replace("если хочешь обсудить возможные варианты", "");
        }

        // Добавление имени пользователя в другие ответы
        if (lowerInput.includes('кто ты') || lowerInput.includes('какая версия')) {
            aiReplyText = `Привет, ${userName}! Я ассистент Textly, версия 0.01. Всегда рядом, чтобы подсказать, куда нажимать 😉`;
        }

        // Логика для отображения информации о подписке
        if (!messages.some(msg => msg.role === 'system' && msg.text.includes('Подписка'))) {
            let subscriptionMessage = '';
            if (subscription === 'free') {
                subscriptionMessage = `У вас бесплатная подписка. Вы можете использовать только "Быстрое создание" и только 1 работу.`;
            } else if (subscription === '3day') {
                subscriptionMessage = `У вас подписка на 3 дня. Доступ к быстрому созданию работы.`;
            } else if (subscription === 'full') {
                subscriptionMessage = `У вас полная подписка. Вы можете использовать все функции приложения.`;
            }

            const subscriptionReply = {
                id: (Date.now() + 1).toString(),
                role: 'system',
                text: subscriptionMessage,
            };

            setMessages([subscriptionReply, ...updatedMessages]);
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([subscriptionReply, ...updatedMessages]));
        }

        const aiReply = {
            id: (Date.now() + 2).toString(),
            role: 'model',
            text: aiReplyText,
        };

        const newMessages = [...updatedMessages, aiReply];
        setMessages(newMessages);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newMessages));
    } catch (error) {
        console.error('Ошибка Gemini:', error);
    } finally {
        setLoading(false);
    }
};
