import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, FlatList, TouchableWithoutFeedback } from 'react-native';
import DocumentPicker from 'react-native-document-picker';

const DocumentModal = ({ visible, onClose, documents, setDocuments }) => {
    const handlePickDocument = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.pdf, DocumentPicker.types.docx],
            });
            setDocuments((prevDocs) => [...prevDocs, res]);
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // User canceled the picker
            } else {
                throw err;
            }
        }
    };

    const handleRemoveDocument = (uri) => {
        setDocuments((prevDocs) => prevDocs.filter((doc) => doc.uri !== uri));
    };

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Загрузить требования</Text>

                        <FlatList
                            data={documents}
                            keyExtractor={(item) => item.uri}
                            renderItem={({ item }) => (
                                <View style={styles.documentItem}>
                                    <Text style={styles.documentText}>{item.name}</Text>
                                    <TouchableOpacity onPress={() => handleRemoveDocument(item.uri)}>
                                        <Text style={styles.removeText}>Удалить</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        />

                        <TouchableOpacity style={styles.button} onPress={handlePickDocument}>
                            <Text style={styles.buttonText}>Загрузить файл</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.button} onPress={onClose}>
                            <Text style={styles.buttonText}>Закрыть</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#FFF',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    documentItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        width: '100%',
    },
    documentText: {
        fontSize: 16,
        color: '#333',
    },
    removeText: {
        color: 'red',
        fontSize: 14,
    },
    button: {
        backgroundColor: '#8B4513',
        paddingVertical: 12,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#FFF8DC',
        fontSize: 16,
    },
});

export default DocumentModal;
