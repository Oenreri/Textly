import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, TouchableWithoutFeedback, Animated, Modal, StyleSheet, Image, FlatList, ToastAndroid } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Dimensions } from 'react-native';
import { useAvatar } from '../../src/screens/Home/AvatarContext';
import { useUser } from '../../src/screens/Home/UserContext';
import LinearGradient from 'react-native-linear-gradient';
import { LayoutAnimation } from 'react-native';

const { width } = Dimensions.get('window');

const Menu = ({ visible, onClose, onNavigate, activeScreen, recentWorks, isDarkMode, toggleTheme }) => {
    const slideAnim = useRef(new Animated.Value(width)).current;
    const { avatar } = useAvatar();
    const { user, userRole } = useUser();

    const subscriptionTitles = {
        'free': 'Бесплатная',
        '3day': 'Трехдневная',
        '2week': 'На 2 недели',
        'diploma': 'Дипломная работа на 2 дня',
        'full': 'На месяц',
        '3month': 'Трехмесячная',
    };

    const userSubscription = user?.subscription || 'none';
    const subscriptionTitle = subscriptionTitles[userSubscription] || 'Нет подписки';

    useEffect(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        Animated.spring(slideAnim, {
            toValue: visible ? 0 : width,
            useNativeDriver: true,
        }).start();
    }, [visible]);

    return (
        <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <Animated.View style={[styles.menuContainer, { transform: [{ translateX: slideAnim }] }]}>
                        <LinearGradient colors={['#6F4E37', '#3E2723']} style={styles.gradientBackground}>
                            {user ? (
                                <TouchableOpacity style={styles.userInfo} onPress={() => { onNavigate('Profile'); onClose(); }} activeOpacity={0.7}>
                                    {avatar ? (
                                        <Image source={{ uri: avatar }} style={styles.avatar} />
                                    ) : (
                                        <Icon name="person" size={80} color="#bbb" />
                                    )}
                                    <View style={styles.userTextContainer}>
                                        <Text style={styles.userName}>{user.name || 'Не указано'} {user.surname || ''}</Text>
                                        <Text style={styles.infoText}>Подписка: {subscriptionTitle}</Text>
                                    </View>
                                </TouchableOpacity>
                            ) : (
                                <MenuItem icon="login" text="Войти" active={activeScreen === 'Auth'} onPress={() => { onNavigate('Auth'); onClose(); }} />
                            )}

                            <View style={styles.menuItemsContainer}>
                                <FlatList
                                    data={recentWorks}
                                    keyExtractor={(item) => item.id.toString()}
                                    renderItem={({ item }) => (
                                        <MenuItem icon="article" text={item.title} onPress={() => { onNavigate('WorkDetail', { id: item.id }); onClose(); }} />
                                    )}
                                />

                                <MenuItem icon="switch-account" text={`Роль: ${userRole}`} onPress={() => {
                                    ToastAndroid.show('Скоро', ToastAndroid.SHORT);
                                    onClose();
                                }} />

                                <MenuItem icon="help" text="FAQ" onPress={() => { onNavigate('SupportScreen'); onClose(); }} />
                            </View>

                            <TouchableOpacity style={styles.subscribeButton} onPress={() => { onNavigate('Subscription'); onClose(); }} activeOpacity={0.7}>
                                <Text style={styles.subscribeText}>Оформить подписку</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    </Animated.View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const MenuItem = React.memo(({ icon, text, active, onPress }) => (
    <TouchableOpacity style={[styles.menuItem, active && styles.activeItem]} onPress={onPress} activeOpacity={0.7}>
        <Icon name={icon} size={24} color="#fff" />
        <Text style={[styles.menuText, active && styles.activeText]}>{text}</Text>
    </TouchableOpacity>
));

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
    },
    menuContainer: {
        width: width * 0.6,
        height: '100%',
        padding: 15,
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    gradientBackground: {
        flex: 1,
        width: '100%',
        padding: 15,
        borderRadius: 15,
    },
    userInfo: {
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#444',
        width: '100%',
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
    },
    userTextContainer: {
        alignItems: 'center',
    },
    userName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
    },
    status: {
        fontSize: 12,
        marginTop: 3,
        color: '#ccc',
        textAlign: 'center',
    },
    menuItemsContainer: {
        marginTop: 15,
        width: '100%',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
        paddingVertical: 8,
        paddingHorizontal: 8,
    },
    activeItem: {
        backgroundColor: '#1E90FF',
        borderRadius: 8,
    },
    menuText: {
        color: '#fff',
        fontSize: 14,
        marginLeft: 10,
    },
    subscribeButton: {
        marginTop: 15,
        backgroundColor: '#ffcc00',
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 10,
        width: '100%',
    },
    subscribeText: {
        color: '#000',
        fontSize: 14,
        fontWeight: 'bold',
    },
    userTextContainer: {
        alignItems: 'center',
        marginTop: 10, // Добавим немного пространства сверху
    },
    infoText: {
        fontSize: 12,
        color: '#bbb', // Цвет может быть немного светлее
        marginTop: 5, // Чтобы не слипалось с основным текстом
        textAlign: 'center',
    },
});

export default Menu;
