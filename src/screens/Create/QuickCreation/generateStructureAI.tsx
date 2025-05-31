import { GEMINI_API_KEY } from '@env';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Создание модели Gemini
const createGenerativeModel = () => {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    return genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
        },
    });
};

export const generateStructure = async (topic: string, language: string, setStructure: Function, workType: string, speciality) => {
    if (!topic) return [];

    try {
        const model = createGenerativeModel();
        const normalizedWorkType = workType.trim().toLowerCase(); // Приведение к нижнему регистру

        let prompt = '';

        if (normalizedWorkType === 'эссе') {
            prompt = `Создай JSON-структуру эссе по теме: "${topic}". Язык: ${language}.  
В эссе должно быть только три части: Введение, Основная часть и Заключение.  
❗Важно: Не добавляй примеры текста, только заголовки разделов.  
Ответ должен быть строго в виде JSON-массива без пояснений и дополнительного текста:
[
  { "title": "Введение" },
  { "title": "Основная часть" },
  { "title": "Заключение" }
]`;
        } else {
            prompt = `Создай JSON-структуру академической работы по теме: "${topic}". Язык: ${language}. Тип работы: ${workType}. Специальность: ${speciality}.
Важно: У каждого раздела может быть только один уровень подразделов (например, 1.1, 1.2). Вложенные подуровни (например, 1.1.1, 1.1.2) не нужны.  
Не добавляй примеры текста, только заголовки.  
Ответ должен быть строго в виде JSON-массива без пояснений и дополнительного текста:
[
  { "title": "Введение" },
  { "title": "Глава 1. Теоретические основы", "subSections": [ { "title": "1.1. Введение в тему" }, { "title": "1.2. Анализ литературы" } ] },
  { "title": "Заключение" }
]
не пиши приложение`;
        }

        console.log("Используемый промпт:", prompt); // Лог для проверки

        const result = await model.generateContent(prompt);

        if (!result || !result.response) {
            console.error('Ошибка: Пустой ответ от модели');
            return [];
        }

        const responseText = await result.response.text();
        console.log('Сырые данные из Gemini:', responseText);

        // Попытка найти JSON в ответе
        const jsonMatch = responseText.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
            console.error('Ошибка: JSON не найден в ответе');
            return [];
        }

        try {
            const parsedStructure = JSON.parse(jsonMatch[0]).map((item: any) => ({
                title: item.title,
                subSections: item.subSections || [],
            }));

            console.log('Сформированная структура:', JSON.stringify(parsedStructure, null, 2));

            setStructure(parsedStructure);
            return parsedStructure;
        } catch (jsonError) {
            console.error('Ошибка при парсинге JSON:', jsonError);
            return [];
        }
    } catch (error) {
        console.error('Ошибка при генерации структуры:', error);
        return [];
    }
};
