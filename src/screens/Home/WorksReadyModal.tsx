import React, { useEffect, useRef } from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList, ActivityIndicator, StyleSheet, Animated, Alert } from 'react-native';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useWorksReadyModal } from './WorksReadyModalContext';
import Share from 'react-native-share';
import { useUser } from './UserContext';  // Импортируем контекст пользователя для получения userId

const WorksReadyModal = () => {
    const {
        worksReadyModalVisible,
        toggleWorksReadyModal,
        works,
        deleteWork,
    } = useWorksReadyModal();

    const { user } = useUser(); // Получаем текущего пользователя из контекста
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (worksReadyModalVisible) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            fadeAnim.setValue(0);
        }
    }, [worksReadyModalVisible]);

    const updateWorkStatus = (workId, status) => {
        setWorkList(prevWorkList =>
            prevWorkList.map(work =>
                work.id === workId ? { ...work, status } : work
            )
        );
    };

    const handleShare = async (filePath) => {
        if (!filePath) {
            Alert.alert('Ошибка', 'Файл не найден.');
            return;
        }

        try {
            await Share.open({
                url: `file://${filePath}`,
                type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                saveToFiles: true,
            });
        } catch (error) {
            console.error('🚨 Ошибка при скачивании файла:', error);
        }
    };



    const formatDate = (dateString) => {
        if (!dateString) return "Неизвестная дата";
        return dateString.split("T")[0]; // Оставляет только "ГГГГ-ММ-ДД"
    };

    const renderWorkItem = ({ item }) => (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Swipeable
                renderLeftActions={() => (
                    <TouchableOpacity style={styles.deleteButton} onPress={() => deleteWork(item.id)}>
                        <Icon name='delete' size={24} color='#FFF' />
                    </TouchableOpacity>
                )}
            >
                <TouchableOpacity style={styles.workRow}>
                    <Text style={styles.workTitle}>{item.title}</Text>
                    <View style={styles.statusContainer}>
                        <Text style={styles.workDate}>{formatDate(item.date)}</Text>

                        <Icon
                            name='loop'
                            size={20}
                            color={item.status === 'ready' ? '#4CAF50' : '#FFC107'}
                            style={{ marginLeft: 5 }}
                        />
                    </View>
                    {item.status === 'processing' ? (
                        <ActivityIndicator size='small' color='#5A3E2B' />
                    ) : (
                        <TouchableOpacity onPress={() => handleShare(item.filePath)}>
                            <Icon name='file-download' size={24} color='#5A3E2B' />
                        </TouchableOpacity>
                    )}
                </TouchableOpacity>
            </Swipeable>
        </GestureHandlerRootView>
    );

    return (
        <Modal animationType='none' transparent={true} visible={worksReadyModalVisible} onRequestClose={toggleWorksReadyModal}>
            <View style={styles.modalBackground}>
                <Animated.View style={[styles.modalContainer, { opacity: fadeAnim }]}>
                    <TouchableOpacity style={styles.closeButton} onPress={toggleWorksReadyModal}>
                        <Icon name='close' size={24} color='#5A3E2B' />
                    </TouchableOpacity>
                    <Text style={styles.title}>Созданные работы</Text>
                    <FlatList
                        data={works}
                        keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
                        renderItem={renderWorkItem}
                        ListEmptyComponent={<Text style={styles.emptyText}>Нет работ</Text>}
                        keyboardShouldPersistTaps='handled'
                        nestedScrollEnabled={true}
                        style={{ width: '100%' }}
                    />
                </Animated.View>
            </View>
        </Modal>
    );
};


const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '90%',
        height: '55%',
        backgroundColor: '#E1C4A9',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
        position: 'relative',
        maxHeight: '85%',
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        padding: 5,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#5A3E2B',
        marginBottom: 15,
    },
    workTitle: {
        flex: 1,
        fontSize: 13,
        color: '#5A3E2B',
        fontWeight: 'bold',
        flexWrap: 'wrap',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
   
    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    emptyText: {
        fontSize: 16,
        color: '#B0B0B0',
    },
});

export default WorksReadyModal;
