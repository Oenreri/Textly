import React, { useEffect } from 'react';
import { PermissionsAndroid, Platform, Linking, Alert } from 'react-native';

// Функция для запроса разрешений
const requestPermissions = async () => {
    if (Platform.OS === 'android') {
        try {
            const permissions = [
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            ];

            const granted = await PermissionsAndroid.requestMultiple(permissions);

            const allGranted = Object.values(granted).every(
                status => status === PermissionsAndroid.RESULTS.GRANTED
            );

            if (!allGranted) {
                console.log('Доступ к хранилищу отклонён');
                return false;
            }

            console.log('Доступ к хранилищу разрешён');

            // Android 11+ (API 30): MANAGE_EXTERNAL_STORAGE требует отдельного запроса
            if (Platform.Version >= 30) {
                const managePermission = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.MANAGE_EXTERNAL_STORAGE
                );

                if (managePermission !== PermissionsAndroid.RESULTS.GRANTED) {
                    Alert.alert(
                        'Разрешение на доступ',
                        'Для полной работы приложения необходимо вручную выдать доступ в настройках.',
                        [
                            { text: 'Отмена', style: 'cancel' },
                            { text: 'Открыть настройки', onPress: () => Linking.openSettings() }
                        ]
                    );
                    return false;
                }
            }

            return true;
        } catch (err) {
            console.warn(err);
            return false;
        }
    }
    return true; // На iOS разрешения не требуются
};

// Компонент Permissions
const Permissions = () => {
    useEffect(() => {
        requestPermissions(); // Запрашиваем разрешения при старте компонента
    }, []);

    return null; // Компонент не отрисовывает UI, только запрашивает разрешения
};

export { requestPermissions };
export default Permissions;
