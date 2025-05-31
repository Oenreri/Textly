import { GEMINI_API_KEY } from '@env';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Создание модели
const createGenerativeModel = () => {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    return genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: {
            temperature: 0.5,
            maxOutputTokens: 4096,
        },
    });
};

// Создание промпта для раздела
const createSectionPrompt = ({ topic, workType, language, sectionTitle, description, pages, comment, course, specialty, sectionWords }) => {
    return `Ты — профессиональный автор академических работ, пишущий на языке **${language}**. Напиши раздел "${sectionTitle}" для работы типа **${workType}**.

    📌 **Тип работы:** ${workType}
    🔹 **Тема:** "${topic}"
    🔹 **Язык:** ${language}
    🔹 **Объем:** минимум ${sectionWords} символов (~${pages} страниц).
    🔹 **Формат:** ГОСТ и академический стиль.
    
    📖 **Требования к содержанию:** ${description || "Следуй академическим стандартам."}
    ${comment ? `💬 **Комментарий:** ${comment}` : ""}
    🔹 **Уровень написания:** ${course || "Не указан"}
    🔹 **Специальность:** ${specialty || "Не указана"}

    ✨ **Стиль текста:** Текст должен быть формальным, четким и структурированным. Соблюдай академический стиль.
    ВАЖНО!
    НЕ ДОБАВЛЯЙ ПОДРАЗДЕЛЫ ОТ СЕБЯ. ПИШИ ТОЛЬПО ПО ТЕМ ГЛАВАМ И ПОДГЛАВАМ, КОТОРЫЕ ЕСТЬ
    НЕ ИСПОЛЬЗУЙ в конце каждой главы фразы вроде "В заключении", "По итогам", "Кроме того". Пиши от местоимения "я"
    НЕ ИСПОЛЬЗУЙ: "В ЗАКЛЮЧЕНИИ, КРОМЕ ТОГО, ПО ИТОГАМ!!
    НЕ ИСПОЛЬЗУЙ: НАСТОЯЩИЙ РЕФЕРАТ, КУРСОВАЯ, СРС! 


    🔽 **Начни текст ниже:**  
    `;
};

// Функция генерации контента
const generateContent = async (model, section, params, sectionWords) => {
    try {
        const sectionPrompt = createSectionPrompt({
            ...params,
            sectionTitle: section.title,
            description: section.description || "",
            sectionWords
        });

       const result = await model.generateContent({
           contents: [{ role: 'user', parts: [{ text: sectionPrompt }] }],
        });
        const responseText = await result.response.text();

        if (!responseText.trim()) {
            throw new Error("⚠️ API не вернуло текст");
        }

        return responseText
            .replace(/\*{1,2}([^*]+)\*{1,2}/g, '$1')
            .split("\n\n")
            .map(para => para.trim())
            .filter(para => para)
            .join("\n\n");
    } catch (error) {
        console.error("Ошибка генерации контента:", error);
        throw error;
    }
};


export const generateSectionText = async (sections, params, sectionWords) => {
    try {
        if (!sections || sections.length === 0) {
            throw new Error("❌ Ошибка: Структура разделов отсутствует");
        }

        const model = createGenerativeModel();
        let fullText = "";

        for (const section of sections) {
            console.log(`🚀 Генерация текста для раздела: ${section.title}`);
            const sectionText = await generateContent(model, section, params, sectionWords);

            if (!sectionText || sectionText.trim().length === 0) {
                console.warn(`⚠️ Раздел "${section.title}" не был сгенерирован.`);
                continue;
            }

            fullText += `\n\n⟱${sectionText}`;

            // Генерация только заданных подразделов
            if (Array.isArray(section.subSections) && section.subSections.length > 0) {
                for (const subSection of section.subSections) {
                    console.log(`🔍 Генерация подраздела: ${subSection.title}`);
                    const subSectionText = await generateContent(model, subSection, params, sectionWords / 2);

                    if (!subSectionText || subSectionText.trim().length === 0) {
                        console.warn(`⚠️ Подраздел "${subSection.title}" не был сгенерирован.`);
                        continue;
                    }

                    fullText += `\n\n${subSectionText}`;
                }
            } else {
                console.log(`🔹 Раздел "${section.title}" не содержит подразделов.`);
            }
        }

        console.log("✅ Полный текст работы:\n", fullText);
        return fullText;
    } catch (error) {
        console.error("❌ Ошибка в generateSectionText:", error);
        return null;
    }
};
