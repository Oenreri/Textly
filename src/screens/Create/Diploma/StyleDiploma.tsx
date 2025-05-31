import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    background: { flex: 1 },
    container: { alignItems: 'center', paddingVertical: 20, flexGrow: 1, justifyContent: 'center' },
    bigText: { fontSize: 24, fontWeight: 'bold', color: '#5A3E2B', textAlign: 'center', marginBottom: 20 },
    dropdown: { backgroundColor: '#E1C4A9', padding: 15, borderRadius: 8, marginBottom: 10, width: '90%', alignItems: 'center' },
    dropdownText: { color: '#5A3E2B', fontSize: 16 },
    input: { backgroundColor: '#FFF', padding: 10, borderRadius: 8, borderColor: '#5A3E2B', borderWidth: 1, width: '90%', marginBottom: 10 },
    saveButton: { backgroundColor: '#E1C4A9', padding: 15, borderRadius: 10, width: '90%', alignItems: 'center' },
    createButton: { backgroundColor: '#A8D08D', padding: 15, borderRadius: 10, width: '90%', marginTop: 20, alignItems: 'center' },
    buttonText: { color: '#5A3E2B', fontSize: 16, fontWeight: 'bold' },
    modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContainer: { backgroundColor: '#FFF', padding: 15, borderRadius: 10, width: '90%', alignItems: 'center' },
    modalItem: { padding: 15, marginVertical: 5, borderBottomWidth: 1, borderBottomColor: '#DDD', width: '100%', alignItems: 'center' },
    modalText: { fontSize: 16, color: '#5A3E2B' },
    inputContainer: { width: '90%', marginBottom: 20, alignSelf: 'center' },
    modalList: { maxHeight: 300 },
    button: { backgroundColor: '#E1C4A9', padding: 15, borderRadius: 8, width: '90%', marginBottom: 20, alignItems: 'center' },
    modalIconContainer: {
        position: 'absolute',
        right: 20,
        top: '2%',
        padding: 10,
        borderRadius: 50,
    },
    subscriptionText: {
        fontSize: 16,
        color: '#5A3E2B', // Цвет текста для подписки
        marginTop: -30,
        fontWeight: 'bold',
        padding: 20
    },
});

export default styles;

export const customStyles = {
   alertOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    alertBox: {
        width: '85%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    alertTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    alertMessage: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    alertButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    alertButton: {
        flex: 1,
        padding: 10,
        alignItems: 'center',
    },
    alertButtonPrimary: {
        backgroundColor: '#D2A679',
        borderRadius: 5,
    },
    alertButtonText: {
        fontSize: 16,
        
        fontWeight: 'bold',
    },
    };
