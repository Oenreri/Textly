import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import DocumentPicker from 'react-native-document-picker';

const FileModal = ({ visible, onClose }) => {
    const [files, setFiles] = useState([]);  // Хранение списка файлов

    const addFile = async () => {
        try {
            const result = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });
            setFiles((prevFiles) => [...prevFiles, result[0]]); // Добавляем выбранный файл в список
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.log('User canceled the picker');
            } else {
                console.log('Unknown error: ', err);
            }
        }
    };

    const removeFile = (fileToRemove) => {
        setFiles((prevFiles) => prevFiles.filter((file) => file.uri !== fileToRemove.uri)); // Удаляем файл из списка
    };

    return (
        <Modal transparent={true} visible={visible} onRequestClose={onClose}>
            <TouchableOpacity style={styles.modalBackground} activeOpacity={1} onPressOut={onClose}>
                <View style={styles.fileModal}>
                    <Text style={styles.fileModalTitle}>Загруженные файлы</Text>

                    {/* Кнопка загрузки файла */}
                    <TouchableOpacity style={styles.uploadButton} onPress={addFile}>
                        <Text style={styles.uploadButtonText}>Загрузить файл</Text>
                    </TouchableOpacity>

                    {/* Список файлов */}
                    <FlatList
                        data={files}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.fileItem}>
                                <Text style={styles.fileName}>{item.name}</Text>
                                <TouchableOpacity onPress={() => removeFile(item)}>
                                    <Text style={styles.removeFile}>Удалить</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                    <TouchableOpacity style={styles.button} onPress={onClose}>
                        <Text style={styles.buttonText}>Закрыть</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
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
    fileModal: {
        width: '80%',
        backgroundColor: '#FFF',
        padding: 20,
        borderRadius: 10,
    },
    fileModalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    fileItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#DDD',
    },
    fileName: {
        fontSize: 16,
    },
    removeFile: {
        color: 'red',
    },
    button: {
        backgroundColor: '#8B4513',
        paddingVertical: 12,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
    },
    uploadButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    uploadButtonText: {
        color: '#FFF',
        fontSize: 16,
    },
});

export default FileModal;
