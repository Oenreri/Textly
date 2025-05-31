import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
    chatToggle: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#5A3E2B',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 25,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 2 },
        elevation: 5,
        zIndex: 10,
    },
    chatContainer: {
        position: 'absolute',
        top: height * 0.1,
        left: width * 0.05,
        width: width * 0.9,
        height: height * 0.8,
        backgroundColor: '#E1C4A9',
        padding: 15,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        elevation: 10,
        zIndex: 100,
    },
    chatHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#5A3E2B',
    },
    messagesList: {
        flex: 1,
        marginBottom: 10,
    },
    userMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#D6A77A',
        padding: 10,
        borderRadius: 12,
        marginVertical: 4,
        maxWidth: '80%',
    },
    assistantMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 12,
        marginVertical: 4,
        maxWidth: '80%',
    },
    messageText: {
        fontSize: 14,
        color: '#5A3E2B',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
        paddingBottom: 40,
    },
    textInput: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginRight: 10,
        color: '#5A3E2B',
    },
    sendButton: {
        backgroundColor: '#5A3E2B',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 15,
    },
    sendButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    customAlertOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },

    customAlertBox: {
        width: '80%',
        backgroundColor: '#E1C4A9', // обновили фон
        borderRadius: 10,
        padding: 20,
        elevation: 10,
    },

    customAlertTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#5A3E2B', // цвет текста
    },

    customAlertMessage: {
        fontSize: 16,
        marginBottom: 20,
        color: '#5A3E2B', // цвет текста
    },


    customAlertButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },

    alertButton: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
        backgroundColor: '#5A3E2B',
        marginLeft: 10,
    },

    alertButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },

});
