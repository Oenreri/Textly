import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Linking } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SupportScreen = () => {
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('Нет активных запросов');
    const [expandedFAQ, setExpandedFAQ] = useState('Как зарегистрироваться?');

    const sendEmail = () => {
        if (!message.trim()) {
            setStatus('Введите сообщение перед отправкой.');
            return;
        }
        const email = 'textly.dev@gmail.com'; // Замени на нужный email
        const subject = encodeURIComponent('Запрос в поддержку');
        const body = encodeURIComponent(message);
        Linking.openURL(`mailto:${email}?subject=${subject}&body=${body}`);
        setStatus('Открыто почтовое приложение');
        setMessage('');
    };

    return (
        <LinearGradient colors={['#F4E7D4', '#D2A679']} style={styles.background}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Поддержка и FAQ</Text>

                <FAQItem
                    title="Как зарегистрироваться?"
                    content="Для регистрации на платформе нажмите кнопку 'Зарегистрироваться', заполните необходимые поля, и вам на указанный адрес электронной почты будет отправлено SMS-сообщение с подтверждением для завершения регистрации."
                    expandedFAQ={expandedFAQ}
                    setExpandedFAQ={setExpandedFAQ}
                />
                <FAQItem
                    title="Какие способы оплаты доступны?"
                    content="Вы сможете производить оплату с помощью банковской карты."
                    expandedFAQ={expandedFAQ}
                    setExpandedFAQ={setExpandedFAQ}
                />
                <FAQItem
                    title="Как изменить язык интерфейса?"
                    content="На данный момент в приложении поддерживается только русский язык. В дальнейшем планируется добавление дополнительных языков."
                    expandedFAQ={expandedFAQ}
                    setExpandedFAQ={setExpandedFAQ}
                />
                <FAQItem
                    title="Вопросы по подписке"
                    content="Вопросы и запросы по подписке можно направить через форму поддержки. Мы также предоставляем возможность узнать подробности по вашим текущим подпискам."
                    expandedFAQ={expandedFAQ}
                    setExpandedFAQ={setExpandedFAQ}
                />

                <Text style={styles.subtitle}>Чат с поддержкой</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Введите сообщение..."
                    multiline
                    placeholderTextColor="#666"
                    value={message}
                    onChangeText={setMessage}
                />
                <TouchableOpacity style={styles.sendButton} onPress={sendEmail}>
                    <Text style={styles.sendText}>Отправить</Text>
                </TouchableOpacity>
                <Text style={styles.status}>{status}</Text>

                <TouchableOpacity style={styles.reviewButton}>
                    <Text style={styles.reviewText}>Оставить отзыв</Text>
                </TouchableOpacity>

                <Text style={styles.privacyText}>Политика конфиденциальности</Text>
            </ScrollView>
        </LinearGradient>
    );
};

const FAQItem = ({ title, content, expandedFAQ, setExpandedFAQ }) => {
    const isExpanded = expandedFAQ === title;
    return (
        <TouchableOpacity style={styles.faqItem} onPress={() => setExpandedFAQ(isExpanded ? '' : title)}>
            <Text style={styles.faqTitle}>{title}</Text>
            <Icon name={isExpanded ? "keyboard-arrow-down" : "keyboard-arrow-right"} size={20} color="#000" />
            {isExpanded && <Text style={styles.faqContent}>{content}</Text>}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    background: { flex: 1 },
    container: { padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#5A3E2B', marginBottom: 20, textAlign: 'center' },
    subtitle: { fontSize: 18, fontWeight: 'bold', color: '#5A3E2B', marginTop: 20, marginBottom: 10 },
    faqItem: { flexDirection: 'column', backgroundColor: '#D2A679', padding: 15, borderRadius: 10, marginBottom: 15 },
    faqTitle: { fontSize: 16, color: '#5A3E2B', flexDirection: 'row', justifyContent: 'space-between' },
    faqContent: { fontSize: 14, color: '#5A3E2B', marginTop: 10 },
    input: { backgroundColor: '#F4E7D4', borderRadius: 10, padding: 10, marginBottom: 10, color: '#5A3E2B' },
    sendButton: { backgroundColor: '#D2A679', padding: 15, borderRadius: 10, alignItems: 'center' },
    sendText: { fontSize: 16, color: '#fff', fontWeight: 'bold' },
    status: { fontSize: 14, color: '#5A3E2B', marginTop: 10, textAlign: 'center' },
    reviewButton: { backgroundColor: '#A67C52', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 20 },
    reviewText: { fontSize: 16, color: '#fff', fontWeight: 'bold' },
    privacyText: { fontSize: 12, color: '#8B6F47', marginTop: 20, textAlign: 'center' },
});


export default SupportScreen;
