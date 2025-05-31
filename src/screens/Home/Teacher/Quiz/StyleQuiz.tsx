import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    background: { flex: 1 },
    scrollContainer: { flexGrow: 1, paddingBottom: 40 },
    container: { alignItems: 'center', paddingVertical: 20, flexGrow: 1, justifyContent: 'center' },
    bigText: { fontSize: 24, fontWeight: 'bold', color: '#5A3E2B', textAlign: 'center', marginBottom: 20 },
    dropdown: { backgroundColor: '#E1C4A9', padding: 15, borderRadius: 8, marginBottom: 10, width: '90%', alignItems: 'center' },
    dropdownText: { color: '#5A3E2B', fontSize: 16 },
    input: { backgroundColor: '#FFF', padding: 10, borderRadius: 8, borderColor: '#5A3E2B', borderWidth: 1, width: '90%', marginBottom: 5 },
    saveButton: { backgroundColor: '#E1C4A9', padding: 15, borderRadius: 10, width: '90%', alignItems: 'center' },
    buttonText: { color: '#5A3E2B', fontSize: 16, fontWeight: 'bold' },
    modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContainer: { backgroundColor: '#FFF', padding: 15, borderRadius: 10, width: '90%', alignItems: 'center' },
    modalItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#E1C4A9', alignItems: 'center' },
    modalText: { fontSize: 16, color: '#5A3E2B' },
    inputContainer: { width: '90%', marginBottom: 5 },
    switchContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 5, width: '90%', justifyContent: 'center' },
    switchLabel: { color: '#5A3E2B', fontSize: 16, marginRight: 10 },
    createButton: { backgroundColor: '#5A3E2B', padding: 15, borderRadius: 10, marginTop: 5, width: '90%', alignItems: 'center' },
    createButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
    modalFlatList: { maxHeight: 300, width: '100%' }
});

export default styles;
