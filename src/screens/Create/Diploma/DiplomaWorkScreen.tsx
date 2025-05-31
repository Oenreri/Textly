import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, Animated, TouchableOpacity, Text, Modal, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useWorksReadyModal } from '../../../../src/screens/Home/WorksReadyModalContext';
import WorksReadyModal from '../../../../src/screens/Home/WorksReadyModal';
import styles, { customStyles } from './StyleDiploma';
import StructureDiploma from './StructureDiploma';
import ModalComponent from './ModalComponent';
import InputFields from './InputFields';
import { useUser } from '../../../../src/screens/Home/UserContext';
import Toast from 'react-native-toast-message';

// Импортируем функцию для создания диплома
import { handleCreateDiplomaWithAI } from './diplomaActions';

const DiplomaCreationScreen = ({ navigation }) => {
    const [workTopic, setWorkTopic] = useState('');
    const [numPages, setNumPages] = useState('');
    const [requirements, setRequirements] = useState('');
    const [suggestions, setSuggestions] = useState('');
    const [isStructureDiplomaVisible, setStructureDiplomaVisible] = useState(false);
    const [structure, setStructure] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false); // Состояние для видимости алерта
    const [alertType, setAlertType] = useState(''); // Тип алерта (авторизация или подписка)

    const { worksReadyModalVisible, toggleWorksReadyModal, addWorkToModal, updateWorkInModal } = useWorksReadyModal();
    const { user } = useUser();
    const [selectedCategory, setSelectedCategory] = useState({
        speciality: '',
        language: '',
        subject: '',
        workType: '',
        researchType: '',
        formattingStyle: ''
    });
    const userSubscription = user?.subscription || 'free'; // Получаем подписку пользователя
    const subscriptionTitles = {
        'free': 'Бесплатная',
        '3day': 'Трехдневная',
        '2week': 'На 2 недели',
        'diploma': 'Дипломная работа на 2 дня',
        'full': 'На месяц',
        '3month': 'Трехмесячная',
    };
    const subscriptionTitle = subscriptionTitles[userSubscription];

    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, []);

    const showToast = (message, type = 'error') => {
        Toast.show({
            type, // 'success' | 'error' | 'info'
            text1: message,
            position: 'top',
            visibilityTime: 4000,
        });
    };

    const handleCreateDiploma = () => {
        if (!user) { // Если пользователь не авторизован
            setAlertType('auth');
            setAlertVisible(true);
            return;
        }
        const allowedSubscriptions = ['diploma', 'full', '3month'];
        if (!allowedSubscriptions.includes(userSubscription)) { // Если подписка не подходит
            setAlertType('subscription');
            setAlertVisible(true);
            return;
        }
        if (userSubscription === 'free') { // Если подписка не активна
            setAlertType('subscription');
            setAlertVisible(true);
            return;
        }

        handleCreateDiplomaWithAI(
            workTopic,
            numPages,
            requirements,
            suggestions,
            structure,
            selectedCategory,
            setLoading,
            addWorkToModal,
            updateWorkInModal,
            showToast
        );
    };

    return (
        <LinearGradient colors={['#F4E7D4', '#D2A679']} style={styles.background}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Animated.View style={{ ...styles.container, opacity: fadeAnim }}>
                    <Text style={styles.bigText}>Дипломная работа</Text>
                    <Text style={styles.subscriptionText}>
                        {user ? `Подписка: ${subscriptionTitle}` : ''}
                    </Text>
                    <ModalComponent selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />

                    <InputFields
                        workTopic={workTopic}
                        setWorkTopic={setWorkTopic}
                        numPages={numPages}
                        setNumPages={setNumPages}
                        requirements={requirements}
                        setRequirements={setRequirements}
                        suggestions={suggestions}
                        setSuggestions={setSuggestions}
                        onStructurePress={() => setStructureDiplomaVisible(true)}
                        onCreatePress={handleCreateDiploma}  // Запуск ИИ
                    />

                    <TouchableOpacity
                        style={styles.modalIconContainer}
                        onPress={toggleWorksReadyModal}
                    >
                        <Icon name="folder" size={28} color="#5A3E2B" />
                    </TouchableOpacity>

                    {/* Модальные окна для авторизации и подписки */}
                    <Modal
                        visible={alertVisible}
                        transparent
                        animationType="fade"
                        onRequestClose={() => setAlertVisible(false)}
                    >
                        <View style={customStyles.alertOverlay}>
                            <View style={customStyles.alertBox}>
                                <Text style={customStyles.alertTitle}>Внимание</Text>
                                <Text style={customStyles.alertMessage}>
                                    {alertType === 'auth'
                                        ? 'Вы должны быть авторизованы для создания работы.'
                                        : 'Для создания работы, у вас должна быть активная подписка "Дипломная работа на 2 дня"'
                                    }
                                </Text>
                                <View style={customStyles.alertButtons}>
                                    <TouchableOpacity style={customStyles.alertButton} onPress={() => setAlertVisible(false)}>
                                        <Text style={customStyles.alertButtonText}>Отмена</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[customStyles.alertButton, customStyles.alertButtonPrimary]}
                                        onPress={() => {
                                            setAlertVisible(false);
                                            if (alertType === 'auth') {
                                                navigation.navigate('Auth');
                                            } else if (alertType === 'subscription') {
                                                navigation.navigate('Subscription');
                                            }
                                        }}
                                    >
                                        <Text style={customStyles.alertButtonText}>
                                            {alertType === 'auth' ? 'Авторизация' : 'Подписка'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </Animated.View>
            </ScrollView>

            <WorksReadyModal visible={worksReadyModalVisible} onClose={toggleWorksReadyModal} />

            <StructureDiploma
                setStructure={setStructure}
                visible={isStructureDiplomaVisible}
                onClose={() => setStructureDiplomaVisible(false)}
                structure={structure}
                workType={selectedCategory.workType}
                language={selectedCategory.language}
                speciality={selectedCategory.speciality}
                workTopic={workTopic}
            />
        </LinearGradient>
    );
};

export default DiplomaCreationScreen;
