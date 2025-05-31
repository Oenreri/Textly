import { GEMINI_API_KEY } from '@env';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Создание модели генерации
const createGenerativeModel = () => {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    return genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: {
            temperature: 0.4,  // Академический стиль
            maxOutputTokens: 4096,  // Лимит токенов
        },
    });
};

// Функция генерации структуры дипломной работы
export const generateThesisStructure = async (workTopic, language, workType, speciality, setStructure) => {
    try {
        const model = createGenerativeModel();
        const prompt = `
Создай JSON-структуру дипломной работы по теме: "${workTopic}". Язык: ${language}. Тип работы: ${workType}. Специальность: ${speciality}.
Важно:
- У каждого раздела может быть только один уровень подразделов (например, 1.1, 1.2). Вложенные подуровни (например, 1.1.1, 1.1.2) не нужны.
- Не добавляй примеры текста, только заголовки.
- Ответ должен быть строго в виде JSON-массива без пояснений и дополнительного текста:

[
  { "title": "Введение" },
  { "title": "Глава 1. Теоретические основы", "subSections": [ 
      { "title": "1.1. Введение в тему" }, 
      { "title": "1.2. Анализ литературы" } 
  ] },
  { "title": "Глава 2. Методология исследования", "subSections": [ 
      { "title": "2.1. Методы исследования" }, 
      { "title": "2.2. Описание экспериментов" } 
  ] },
  { "title": "Заключение" }
]
    Важно! НЕ ДОБАВЛЯЙ ПРИЛОЖЕНИЕ!`;
  
        // Отправляем запрос
        const result = await model.generateContent(prompt);

        // Проверяем, есть ли текстовый ответ
        if (!result || !result.response || typeof result.response.text !== 'function') {
            throw new Error('Некорректный ответ от модели');
        }

        const rawText = await result.response.text(); // Получаем текст

        // Очищаем от лишнего текста (удаляем обертку ```json ... ```)
        const cleanText = rawText.replace(/```json|```/g, '').trim();

        // Пробуем разобрать JSON
        return JSON.parse(cleanText);
    } catch (error) {
        console.error('Ошибка при генерации структуры:', error.message);
        return { sections: [] }; // Возвращаем пустую структуру при ошибке
    }
};

export { generateThesisStructure };
