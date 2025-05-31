import { generateDiplomaText } from './diplomaAI';
import { createDiplomaDOCX } from './DiplomaDocx';
import KeepAwake from 'react-native-keep-awake';
import PushNotification from 'react-native-push-notification';

// Функция для отправки локального уведомления
const showCompletionNotification = (title) => {
    PushNotification.localNotification({
        channelId: "work-status", // Убедись, что канал создан
        title: "Работа готова!",
        message: `Диплом "${title}" успешно создан.`,
        playSound: true,
        soundName: "default",
    });
};

export const handleCreateDiplomaWithAI = async (
    workTopic,
    numPages,
    requirements,
    suggestions,
    structure,
    selectedCategory,
    setLoading,
    addWorkToModal,
    updateWorkInModal,
    showToast
) => {
    setLoading(true); // Устанавливаем статус загрузки в true
    KeepAwake.activate(); // Предотвращаем уход устройства в сон

    try {
        if (!workTopic.trim()) {
            showToast('Введите тему работы перед продолжением.');
            return;
        }

        if (!structure?.length) {
            showToast('Добавьте структуру');
            return;
        }

        const pages = Number(numPages);
        if (isNaN(pages) || pages <= 0) {
            showToast('Укажите корректное количество страниц.');
            return;
        }

        if (pages > 60) {
            showToast('Максимальное количество страниц — 60.');
            return;
        }

        // Создаём временный ID работы
        const workId = Date.now().toString();

        // Добавляем работу в модальное окно с "Создается"
        addWorkToModal({
            id: workId,
            title: workTopic,
            status: 'processing', // Работа создаётся
            filePath: null,
            date: new Date().toISOString(),
        });

        // Показываем уведомление о начале процесса
        showToast('Создание диплома...');

        const requestParams = {
            topic: workTopic,
            pages,
            speciality: selectedCategory.speciality || "Не указано",
            language: selectedCategory.language || "Русский",
            workType: selectedCategory.workType || "Дипломная работа",
            researchType: selectedCategory.researchType || "Исследовательская работа",
            formattingStyle: selectedCategory.formattingStyle || "ГОСТ",
            requirements,
            suggestions,
            structure
        };

        console.log("🔹 Отправка запроса в ИИ:", requestParams);
        const diplomaText = await generateDiplomaText(requestParams);

        if (!diplomaText?.trim()) {
            console.error("❌ Ошибка: AI не смог сгенерировать текст.");
            showToast('Ошибка: AI не смог сгенерировать текст.');
            return;
        }

        const filePath = await createDiplomaDOCX(workTopic, diplomaText, structure);
        if (!filePath) {
            console.error("❌ Ошибка при создании файла DOCX");
            showToast('Ошибка при создании файла.');
            return;
        }

        // Обновляем существующую запись с новым статусом и убираем индикатор загрузки
        updateWorkInModal(workId, {
            status: 'ready', // Работа готова
            filePath,
        });

        showToast('Диплом успешно создан!');
        showCompletionNotification(workTopic); // Отправка уведомления
    } catch (error) {
        console.error("❌ Ошибка при создании дипломной работы:", error);
        showToast('Ошибка при создании дипломной работы.');
    } finally {
        KeepAwake.deactivate(); // Позволяем устройству снова засыпать
        setLoading(false); // Скрываем индикатор загрузки
    }
};
