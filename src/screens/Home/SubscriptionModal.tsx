import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';

const SubscriptionModal = ({ isVisible, onClose, subscription, expiryDate }) => {
    if (!subscription) return null;

    return (
        <Modal transparent visible={isVisible} animationType="slide">
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>{subscription.title}</Text>
                    <Text style={styles.subscriptionTitle}>{subscription.description}</Text>
                    
                    <Text style={styles.subscriptionExpiry}>Действует до: {new Date(expiryDate).toLocaleDateString()}</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>Закрыть</Text>
                    </TouchableOpacity>
                </View>
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
        backgroundColor: '#4B0082',
        width: '80%',
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFD700',
        marginBottom: 15,
    },
    subscriptionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 10,
    },
    subscriptionExpiry: {
        fontSize: 14,
        color: '#ddd',
        textAlign: 'center',
        marginBottom: 5,
    },
    closeButton: {
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 25,
        backgroundColor: '#FFD700',
        borderRadius: 10,
    },
    closeButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4B0082',
    },
});

export default SubscriptionModal;
