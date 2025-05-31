import Toast from 'react-native-toast-message';
import { Alert } from 'react-native';
import { generateEssay } from "./essayGenerator";
import { createDOCX } from './DOCXService';
import { createEssayDOCX } from './EssayDocxService';
import { generateSectionText } from './workGenerator';
import KeepAwake from 'react-native-keep-awake';
import PushNotification from 'react-native-push-notification';

// Функция для отправки локального уведомления
const showCompletionNotification = (title) => {
    PushNotification.localNotification({
        channelId: "work-status", // Убедись, что канал создан
        title: "Работа готова!",
        message: `Работа "${title}" успешно создана.`,
        playSound: true,
        soundName: "default",
    });
};

export const showToast = (message) => {
    Toast.show({
        type: 'success', // Тип уведомления: 'success', 'error', 'info'
        position: 'top', // Позиция: 'top', 'bottom'
        text1: message, // Текст
    });
};

export const showAlert = (message) => {
    Alert.alert("Сообщение", message, [{ text: "OK" }]);
};

export const handleQuitWorkWithAI = async (params, addWorkToModal, updateWorkInModal) => {
    KeepAwake.activate(); // Предотвращаем засыпание устройства

    try {
        const { topic, structure, selectedCategory, pages, comment, requirements } = params;

        if (!topic.trim()) {
            showToast('Введите тему работы перед продолжением.');
            return;
        }
        if (!structure?.length) {
            showToast('Добавьте структуру');
            return;
        }
        if (!pages || pages <= 0) {
            showToast('Введите количество страниц перед продолжением.');
            return;
        }

        const maxPages = selectedCategory.workType === 'Эссе' ? 7 : 35;
        if (pages > maxPages) {
            showToast(`Максимальное количество страниц — ${maxPages}.`);
            return;
        }

        console.log("📌 Проверка структуры перед отправкой:", structure);
        const workId = Date.now().toString();

        // Добавляем в модальное окно статус "создание"
        addWorkToModal({
            id: workId,
            title: topic,
            status: 'processing',  // Указываем, что работа создается
            filePath: null,
            date: new Date().toISOString(),
        });

        // Показываем уведомление о начале процесса
        showToast('Создание работы...');

        const requestParams = {
            topic,
            pages,
            speciality: selectedCategory.speciality || "Не указано",
            course: selectedCategory.course || "Университет",
            language: selectedCategory.language || "Русский",
            workType: selectedCategory.workType || "Реферат",
            comment,
            requirements,
            structure
        };

        let SectionText;
        if (selectedCategory.workType === 'Эссе') {
            SectionText = await generateEssay(requestParams);
        } else {
            SectionText = await generateSectionText(requestParams.structure, requestParams);
        }

        if (!SectionText?.trim()) {
            console.error("❌ Ошибка: AI не смог сгенерировать текст.");
            showToast('Ошибка: AI не смог сгенерировать текст.');
            return;
        }

        let filePath;
        if (selectedCategory.workType === 'Эссе') {
            filePath = await createEssayDOCX(topic, SectionText, structure);
        } else {
            filePath = await createDOCX(topic, SectionText, structure);
        }

        if (!filePath) {
            console.error("❌ Ошибка при создании файла DOCX");
            showToast('Ошибка при создании файла.');
            return;
        }

        updateWorkInModal(workId, { status: 'ready', filePath });
        showToast('Работа успешно создана!');
        showCompletionNotification(topic); // Отправка уведомления

    } catch (error) {
        console.error("❌ Ошибка при создании документа:", error);
        showToast('Ошибка при создании документа.');
    } finally {
        KeepAwake.deactivate(); // Позволяем устройству снова засыпать
    }
};
