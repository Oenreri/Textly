import { GEMINI_API_KEY } from '@env';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Создание модели генерации
const createGenerativeModel = () => {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    return genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: {
            temperature: 0.3, // Стиль для академического текста
            maxOutputTokens: 4096, // Лимит токенов
        },
    });
};


const wordsPerPage = 1600;

const createSectionPrompt = ({ topic, speciality, language, workType, researchType, formattingStyle, sectionTitle, description, sectionWords }) => {
    return `Ты — профессиональный автор академических работ, пишущий на языке **${language}**. Напиши раздел "${sectionTitle}" для работы типа **${workType.toUpperCase()}**.

    📌 **Тип работы:** ${workType}
    🔹 **Тема:** "${topic}"
    🔹 **Специальность:** ${speciality}
    🔹 **Язык:** ${language}
    🔹 **Тип исследования:** ${researchType}
    🔹 **Объем:** минимум ${sectionWords} символов.
    🔹 **Формат:** Соблюдай стандарт ${formattingStyle} и академический стиль.

    📖 **Требования к содержанию:** ${description || "Следуй академическим стандартам."}

    ⚠️ **Важно:** Пиши **только** по указанной структуре. Не добавляй новые разделы, пункты или темы. Строго соблюдай заголовки.
    "Добавь больше примеров, фактов и объяснений. Расширяй аргументы."
    НЕ ДОБАВЛЯЙ ПОДРАЗДЕЛЫ ОТ СЕБЯ. ПИШИ ТОЛЬПО ПО ТЕМ ГЛАВАМ И ПОДГЛАВАМ, КОТОРЫЕ ЕСТЬ
    ✨ **Стиль текста:** Сделай текст живым, естественным, с плавными переходами и академическим стилем.
    ТЫ ПИШЕШЬ ПОЛНОЦЕННУЮ, АКАДЕМИЧЕСКУЮ РАБОТУ! не добавляй вроде: [УКАЗАТЬ КОНКРЕТНЫЙ ПРИМЕР] - НЕ ПИШИ ТАКОГО! ПРИВЕДИ ПРИМЕР КОНКРЕТНЫЙ.
    ПОСЛЕ ДОБАВЛЕНИЯ ТЕКСТА ТЫ ВСТАВЛЯЕШЬ ЕЩЁ И СИМВОЛЫ #, ## И ** - УБЕРИ ИХ ПОСЛЕ!
    НЕ ИСПОЛЬЗУЙ СЛИШКОМ ЧАСТО ТАКИЕ СЛОВА ВРОДЕ: В ЗАКЛЮЧЕНИИ, ТАКИМ ОБРАЗОМ, Вступление!
    НЕ ИСПОЛЬУЙ ** ТАКИЕ СИМВОЛЫ В ТЕКСТЕ, ЧТОБЫ ДЕЛАТЬ ЖИРНЫМИ. ПРОСТО СДЕЛАЙ ИХ ЖИРНЫМИ
    Не пиши [укажите], сам указывай и сам пиши
    ИСПОЛЬЗУЙ МЕСТОИМЕНИЕ "Я": "МНОЮ БЫЛА НАПИСАНА, Я ИССЛЕДОВАЛ...."
    НЕ ДОБАВЛЯЙ РАЗДЕЛЫ И ПОДРАЗДЕЛЫ ОТ СЕБЯ, ПИШИ СТРОГО ПО ИМЕЮЩЕЙ СТРУКТУРЕ
    --- 
    **Начни текст ниже:**  
    `;
};

const generateContent = async (model, prompt) => {
    try {
        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
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

const generateSectionText = async (model, section, params, sectionWords) => {
    const sectionPrompt = createSectionPrompt({
        ...params,
        sectionTitle: section.title,
        description: section.description || "",
        sectionWords
    });

    console.log(`🚀 Генерация: ${section.title} (≈ ${sectionWords} символов) для ${params.workType}`);
    return await generateContent(model, sectionPrompt);
};


export const generateDiplomaText = async (params) => {
    console.log('🔍 Входящие параметры:', params);
    const model = createGenerativeModel();
    console.log("📝 Генерация текста по структуре...");

    const totalWords = params.pages * wordsPerPage;
    let allocatedWords = 0;
    const diplomaParts = [];

    // Подсчёт количества секций и подразделов
    const totalSections = params.structure.reduce((count, section) =>
        count + (section.subSections ? section.subSections.length : 0) + 1, 0);

    for (const section of params.structure) {
        if (!section.title) {
            console.warn("⚠️ Пропущен раздел без заголовка.");
            continue;
        }

        const remainingWords = totalWords - allocatedWords;
        let sectionWords = Math.min(
            Math.round(totalWords / totalSections), // Равномерное распределение
            remainingWords
        );

        if (sectionWords <= 0) {
            console.warn(`⚠️ Пропущен раздел ${section.title}, так как лимит достигнут.`);
            continue;
        }

        let mainSectionWords = sectionWords;
        let subSectionWords = 0;

        if (section?.subSections?.length) {
            // Если есть подглавы, выделяем 200% от стандартного объема
            let sectionTotalWords = sectionWords * 2;
            mainSectionWords = Math.round(sectionTotalWords * 0.33); // Главный раздел — 33%
            subSectionWords = Math.round(sectionTotalWords * 0.67 / section.subSections.length); // Подглавы — 67% на всех
        }

        allocatedWords += mainSectionWords;

        const sectionText = await generateSectionText(model, section, params, mainSectionWords);
        diplomaParts.push(`\n⟱ ${sectionText}`); // Разделяем разделы символом ⟱

        if (section?.subSections?.length) {
            console.log(`🔍 Обрабатываем подглавы для раздела "${section.title}"`);
            for (const subSection of section.subSections) {
                if (!subSection?.title) {
                    console.warn("⚠️ Пропущена подглава без заголовка.");
                    continue;
                }

                const subRemainingWords = totalWords - allocatedWords;
                let subWords = Math.min(subSectionWords, subRemainingWords);

                if (subWords <= 0) {
                    console.warn(`⚠️ Пропущена подглава ${subSection.title}, так как лимит достигнут.`);
                    continue;
                }
                allocatedWords += subWords;

                const subSectionText = await generateSectionText(model, subSection, params, subWords);
                diplomaParts.push(`\n⟰ ${subSectionText}`); // Разделяем подглавы символом ⟰
            }
        }
    }

    return diplomaParts.join("\n\n");
};
