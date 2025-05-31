
import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Animated,
    Modal,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import StructureModal from './StructureModal';
import WorksReadyModal from '../../../../src/screens/Home/WorksReadyModal';
import styles, { customStyles } from './StyleQuick';
import ModalComponents from './ModalComponents';
import QuickCreationInputs from './QuickCreationInputs';
import { useWorksReadyModal } from '../../../../src/screens/Home/WorksReadyModalContext';
import { useUser } from '../../../../src/screens/Home/UserContext';
import { handleWorkCreation, canCreateNewWork } from './WorkCreation';  // Импортируем

const QuickCreationScreen = ({ navigation }) => {
    const [topic, setTopic] = useState('');
    const [pages, setPages] = useState('');
    const [requirements, setRequirements] = useState('');
    const [comment, setComment] = useState('');
    const [alertVisible, setAlertVisible] = useState(false);
    const [subscriptionAlertVisible, setSubscriptionAlertVisible] = useState(false);
    const { user, setUser } = useUser();
 
    const userSubscription = user?.subscription;
   
    const [selectedCategory, setSelectedCategory] = useState({
        speciality: '',
        course: '',
        language: '',
        workType: ''
    });

    const subscriptionTitles = {
        'free': 'Бесплатная',
        '3day': 'Трехдневная',
        '2week': ' На 2 недели',
        'diploma': 'Дипломная работа на 2 дня',
        'full': ' На месяц',
        '3month': 'Трехмесячная',
    };


    const [modalVisible, setModalVisible] = useState({
        speciality: false,
        course: false,
        language: false,
        workType: false
    });

    const { addWorkToModal, updateWorkInModal } = useWorksReadyModal();
    const [structureModalVisible, setStructureModalVisible] = useState(false);
    const [structure, setStructure] = useState([]);
    const { worksReadyModalVisible, toggleWorksReadyModal } = useWorksReadyModal();

    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, []);
    const subscriptionTitle = subscriptionTitles[userSubscription] || 'Нет подписки';

    const handleStartWork = () => {
        if (!user) {
            setAlertVisible(true);
            return;
        }
        if (!userSubscription || userSubscription === 'free') {
            setSubscriptionAlertVisible(true);
            return;
        }
        if (setUser) {
            console.log('setUser доступен:', setUser);  // Проверка, что setUser доступен
        }
        console.log('setUser доступен:', setUser);  // Проверка, что setUser передан корректно
        console.log('Текущая подписка:', userSubscription);
        console.log('Создано работ:', user.createdWorks || 0);
        

        handleWorkCreation(
            {
                topic,
                structure,
                selectedCategory,
                pages,
                comment,
                requirements,
                subscription: userSubscription,
                subscriptionEndDate: user.subscriptionEndDate
            },
            addWorkToModal,
            updateWorkInModal,
            user,
            setUser
        );
    };

    return (
        <LinearGradient colors={['#F4E7D4', '#D2A679']} style={styles.background}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Animated.View style={{ ...styles.container, opacity: fadeAnim }}>
                    <Text style={styles.bigText}>Быстрое создание</Text>
                    <Text style={styles.subscriptionText}>
                        {user ? `Подписка: ${subscriptionTitle}` : ''}
                    </Text>



                    {[{ key: 'workType', label: 'Выберите тип работы' },
                    { key: 'speciality', label: 'Выберите специальность' },
                    { key: 'course', label: 'Выберите уровень' },
                    { key: 'language', label: 'Выберите язык' }].map(({ key, label }) => (
                        <TouchableOpacity key={key} style={styles.dropdown}
                            onPress={() => setModalVisible({ ...modalVisible, [key]: true })}>
                            <Text style={styles.dropdownText}>{selectedCategory[key] || label}</Text>
                        </TouchableOpacity>
                    ))}

                    <ModalComponents
                        modalVisible={modalVisible}
                        setModalVisible={setModalVisible}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                    />

                    <QuickCreationInputs
                        topic={topic}
                        setTopic={setTopic}
                        pages={pages}
                        setPages={setPages}
                        requirements={requirements}
                        setRequirements={setRequirements}
                        comment={comment}
                        setComment={setComment}
                        setStructureModalVisible={setStructureModalVisible}
                        handleQuitWorkWithAI={handleStartWork}
                    />
                </Animated.View>
            </ScrollView>

            <TouchableOpacity style={styles.modalIconContainer} onPress={toggleWorksReadyModal}>
                <Icon name="folder" size={28} color="#5A3E2B" />
            </TouchableOpacity>

            <WorksReadyModal visible={worksReadyModalVisible} onClose={toggleWorksReadyModal} />

            <StructureModal
                visible={structureModalVisible}
                hide={() => setStructureModalVisible(false)}
                language={selectedCategory.language}
                workType={selectedCategory.workType}
                topic={topic}
                structure={structure}
                setStructure={setStructure}
                speciality={selectedCategory.speciality}
            />
            <Modal
                visible={subscriptionAlertVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setSubscriptionAlertVisible(false)}
            >
                <View style={customStyles.alertOverlay}>
                    <View style={customStyles.alertBox}>
                        <Text style={customStyles.alertTitle}>Обновите подписку</Text>
                        <Text style={customStyles.alertMessage}>В бесплатной версии нельзя создать работу.</Text>
                        <View style={customStyles.alertButtons}>
                            <TouchableOpacity style={customStyles.alertButton} onPress={() => setSubscriptionAlertVisible(false)}>
                                <Text style={customStyles.alertButtonText}>Отмена</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[customStyles.alertButton, customStyles.alertButtonPrimary]}
                                onPress={() => { setSubscriptionAlertVisible(false); navigation.navigate('Subscription'); }}>
                                <Text style={customStyles.alertButtonText}>Подписка</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
                visible={alertVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setAlertVisible(false)}
            >
                <View style={customStyles.alertOverlay}>
                    <View style={customStyles.alertBox}>
                        <Text style={customStyles.alertTitle}>Внимание</Text>
                        <Text style={customStyles.alertMessage}>Вы должны быть авторизованы для создания работы.</Text>
                        <View style={customStyles.alertButtons}>
                            <TouchableOpacity style={customStyles.alertButton} onPress={() => setAlertVisible(false)}>
                                <Text style={customStyles.alertButtonText}>Отмена</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[customStyles.alertButton, customStyles.alertButtonPrimary]}
                                onPress={() => { setAlertVisible(false); navigation.navigate('Auth'); }}>
                                <Text style={customStyles.alertButtonText}>Авторизация</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </LinearGradient>
    );
};

export default QuickCreationScreen;
