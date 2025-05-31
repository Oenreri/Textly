import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Menu from '../../components/Menu';
import { useUser } from './UserContext';
import { useWorksReadyModal } from './WorksReadyModalContext';
import WorksReadyModal from './WorksReadyModal';
import MiniChatAssistant from '../../screens/Home/Chat/MiniChatAssistant';

const HomeScreen = ({ navigation }) => {
    const { user } = useUser();
    const { worksReadyModalVisible, toggleWorksReadyModal } = useWorksReadyModal();
    const [isMenuVisible, setMenuVisible] = useState(false);
    const [showChat, setShowChat] = useState(false);

    const userRole = user?.role || 'Студент';
    const isStudent = userRole === 'Студент';

    useEffect(() => {
        console.log('Роль пользователя обновлена:', userRole);
    }, [userRole]);

    const toggleChat = () => {
        setShowChat(!showChat);
    };

    return (
        <LinearGradient colors={['#F4E7D4', '#D2A679']} style={styles.background}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.topBar}>
                    <TouchableOpacity style={styles.iconButton}>
                        <Icon name="language" size={28} color="#5A3E2B" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton} onPress={() => setMenuVisible(true)}>
                        <Icon name="menu" size={28} color="#5A3E2B" />
                    </TouchableOpacity>
                </View>

                <View style={styles.logoContainer}>
                    <Text style={styles.bigText}>Textly</Text>
                    <Text style={styles.subtitle}>Помощник в учёбе и преподавании</Text>
                </View>
            </ScrollView>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[
                        styles.button,
                        isStudent ? styles.activeButton : styles.inactiveButton,
                    ]}
                    onPress={() => isStudent && navigation.navigate('CreateWork')}
                    disabled={!isStudent}
                >
                    <Icon name="school" size={24} color="#5A3E2B" style={styles.buttonIcon} />
                    <Text style={styles.buttonText}>Кабинет студента</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.button,
                        !isStudent ? styles.activeButton : styles.inactiveButton,
                    ]}
                    onPress={() => !isStudent && navigation.navigate('TeacherDashboard')}
                    disabled={isStudent}
                >
                    <Icon name="work" size={24} color="#5A3E2B" style={styles.buttonIcon} />
                    <Text style={styles.buttonText}>Кабинет преподавателя</Text>
                </TouchableOpacity>
            </View>

            <Menu
                visible={isMenuVisible}
                onClose={() => setMenuVisible(false)}
                onNavigate={navigation.navigate}
                activeScreen="Home"
            />

            
            <TouchableOpacity
                style={styles.chatIconContainer}
                onPress={toggleChat}
            >
                <Icon name="chat" size={28} color="#5A3E2B" />
            </TouchableOpacity>

            <MiniChatAssistant isVisible={showChat} toggleChat={toggleChat} />

           
            <TouchableOpacity
                style={styles.modalIconContainer}
                onPress={toggleWorksReadyModal}
            >
                <Icon name="folder" size={28} color="#5A3E2B" />
            </TouchableOpacity>

            <WorksReadyModal />
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    container: {
        alignItems: 'center',
        paddingVertical: 20,
        flexGrow: 1,
        justifyContent: 'space-between',
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 20,
        marginTop: 20,
    },
    iconButton: {
        padding: 10,
    },
    logoContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bigText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#5A3E2B',
    },
    subtitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#5A3E2B',
        marginTop: 5,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 30,
        alignSelf: 'center',
        width: '90%',
        maxWidth: 400,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 10,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
        marginHorizontal: 5,
    },
    activeButton: {
        backgroundColor: '#E1C4A9',
    },
    inactiveButton: {
        backgroundColor: '#C8A27C',
        opacity: 0.6,
    },
    buttonIcon: {
        marginRight: 10,
    },
    buttonText: {
        color: '#5A3E2B',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalIconContainer: {
        position: 'absolute',
        right: 20,
        top: '11%',
        padding: 10,
        borderRadius: 50,
    },
    chatIconContainer: {
        position: 'absolute',
        right: 20,
        bottom: 600,
        padding: 10,
        borderRadius: 50,
       
    },
});

export default HomeScreen;
