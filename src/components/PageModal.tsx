import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, Modal, FlatList, Text, StyleSheet, Dimensions, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');

const PageModal = ({ visible, onClose, pages, setPages, onSelectPage, onAddPage }) => {
    const [deletedPage, setDeletedPage] = useState(null);
    const [deletedIndex, setDeletedIndex] = useState(null);
    const swipeRefs = useRef([]);

    const handleDelete = (index) => {
        setDeletedPage(pages[index]);
        setDeletedIndex(index);
        setPages(pages.filter((_, i) => i !== index));
    };

    const restorePage = () => {
        if (deletedPage !== null && deletedIndex !== null) {
            setPages((prevPages) => {
                const newPages = [...prevPages];
                newPages.splice(deletedIndex, 0, deletedPage);
                return newPages;
            });
            setDeletedPage(null);
            setDeletedIndex(null);
        }
    };

    const renderRightActions = (index) => (
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(index)}>
            <Icon name="trash" size={24} color="white" />
        </TouchableOpacity>
    );

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <Pressable style={styles.modalContainer}>
                <GestureHandlerRootView>
                    <Pressable
                        style={{ flex: 1 }}
                        onPress={() => {
                            swipeRefs.current.forEach((swipe) => {
                                if (swipe) swipe.close();
                            });
                        }}
                    >
                        <FlatList
                            data={pages}
                            keyExtractor={(item, index) => index.toString()}
                            extraData={pages}
                            renderItem={({ item, index }) => (
                                <Swipeable
                                    ref={(ref) => swipeRefs.current[index] = ref}
                                    renderRightActions={() => renderRightActions(index)}
                                    onSwipeableWillOpen={() => {
                                        swipeRefs.current.forEach((swipe, i) => {
                                            if (i !== index && swipe) swipe.close();
                                        });
                                    }}
                                >
                                    <TouchableOpacity
                                        style={styles.pagePreview}
                                        onPress={() => {
                                            swipeRefs.current.forEach((swipe) => {
                                                if (swipe) swipe.close();
                                            });
                                            onSelectPage(index);
                                        }}
                                    >
                                        <Text style={styles.pageText} numberOfLines={5} ellipsizeMode="tail">
                                            {item.content}
                                        </Text>
                                    </TouchableOpacity>
                                </Swipeable>
                            )}
                        />
                    </Pressable>
                </GestureHandlerRootView>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.addButton} onPress={onAddPage}>
                        <Icon name="plus" size={30} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Icon name="times" size={30} color="white" />
                    </TouchableOpacity>
                    {deletedPage && (
                        <TouchableOpacity style={styles.restoreButton} onPress={restorePage}>
                            <Icon name="undo" size={30} color="white" />
                        </TouchableOpacity>
                    )}
                </View>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
    pagePreview: {
        width: width * 0.90,
        height: height * 0.85,
        backgroundColor: '#fff',
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        padding: 10,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    pageText: { color: '#000', textAlign: 'center' },
    buttonContainer: {
        position: 'absolute',
        bottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: '80%',
    },
    addButton: { backgroundColor: '#34C759', padding: 15, borderRadius: 50 },
    closeButton: { backgroundColor: '#007AFF', padding: 15, borderRadius: 50 },
    deleteButton: {
        backgroundColor: '#FF3B30',
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
        height: '50%',
        borderRadius: 10,
        marginLeft: 5,
        marginTop: '25%', // Центрируем кнопку
    },
    restoreButton: { backgroundColor: '#FF9500', padding: 15, borderRadius: 50 },
});

export default PageModal;
