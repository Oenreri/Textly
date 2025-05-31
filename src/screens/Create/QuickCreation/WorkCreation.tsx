import { handleQuitWorkWithAI } from './handleQuickWork';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Функция для обработки создания работы в зависимости от подписки.
 */
export const canCreateNewWork = (subscription, currentWorks) => {
    console.log(`Проверка подписки: ${subscription}, работ создано: ${currentWorks}`);

    if (subscription.toLowerCase() === 'бесплатная') {
        return false; // Полный запрет на создание работ в бесплатной версии
    }

    // Для платных подписок нет ограничений
    return true;
};
