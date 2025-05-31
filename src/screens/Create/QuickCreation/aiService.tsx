import { GEMINI_API_KEY } from '@env';
import { GoogleGenerativeAI } from '@google/generative-ai';

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

const wordsPerPage = 1800;

const createSectionPrompt = ({ topic, style, type, language, sectionTitle, description, sectionWords }) => {
    return `Ты — профессиональный автор академических работ, пишущий на языке **${language}**. Напиши раздел "${sectionTitle}" для работы типа **${type.toUpperCase()}**.

    📌 **Тип работы:** Это важно! Ты пишешь **${type}**, не отклоняйся от жанра.
    🔹 **Тема:** "${topic}"
    🔹 **Язык:** ${language}
    🔹 **Объем:** минимум ${sectionWords} символов.
    🔹 **Формат:** Соблюдай стандарт ${style} и академический стиль.

    📖 **Требования к содержанию:** ${description || "Следуй академическим стандартам."}

    ⚠️ **Форматирование:** Заголовки разделов выделяй жирным шрифтом и отделяй новой строкой и новой страницей. Сдвиг абзаца нужен только по контексту.

    ✨ **Стиль текста:** Сделай текст живым, естественным, с личными рассуждениями, плавными переходами и эмоциональными акцентами. НЕ ИСПОЛЬЗУЙ В КОНЦЕ КАЖДОЙ ГЛАВЫ КОНТЕКСТЫ ВРОДЕ: В ЗАКЛЮЧЕНИИ, ПО ИТОГУ, КРОМЕ ТОГО, ТАКИМ ОБРАЗОМ.

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
            .split("\n\n")
            .map(para => para.trim())
            .filter(para => para)
            .join("\n\n");
    } catch (error) {
        console.error("Ошибка генерации контента:", error);
        throw error;
    }
};

const generateSectionText = async (model, section, topic, style, type, language, sectionWords) => {
    const sectionPrompt = createSectionPrompt({
        topic,
        style,
        type,
        language,
        sectionTitle: section.title,
        description: section.description || "",
        sectionWords
    });

    console.log(`🚀 Генерация: ${section.title} (≈ ${sectionWords} символов) для ${type}`);
    return await generateContent(model, sectionPrompt);
};

export const generateEssay = async ({
    topic = "Без темы",
    pages = 1,
    style = "ГОСТ",
    type = "Эссе",
    language = "Русский",
    comment = "",
    structure = []
}) => {
    console.log('🔍 Входящие параметры:', { topic, pages, style, type, language, comment, structure });
    const model = createGenerativeModel();
    console.log("📝 Генерация текста по структуре...");

    const totalWords = pages * wordsPerPage;
    let allocatedWords = 0;
    const essayParts = [];

    const prompt = `Напиши эссе на тему: "${topic}" (${language}). Объем: ${pages} страниц. 
    Сделай текст живым, естественным, с личными рассуждениями, плавными переходами и эмоциональными акцентами.
    НЕ ИСПОЛЬЗУЙ В КОНЦЕ КАЖДОЙ ГЛАВЫ КОНТЕКСТЫ ВРОДЕ: В ЗАКЛЮЧЕНИИ, ПО ИТОГУ, КРОМЕ ТОГО, ТАКИМ ОБРАЗОМ. НУЖЕН ЖИВОЙ ЭССЕ`;
    console.log("📢 Сгенерированный prompt:", prompt);

    for (const section of structure) {
        if (!section.title) {
            console.warn("⚠️ Пропущен раздел без заголовка.");
            continue;
        }

        const remainingWords = totalWords - allocatedWords;
        let sectionWords = Math.min(
            Math.round(totalWords * (section.proportion || 0.2)),
            remainingWords
        );

        if (sectionWords <= 0) {
            console.warn(`⚠️ Пропущен раздел ${section.title}, так как лимит достигнут.`);
            continue;
        }
        allocatedWords += sectionWords;

        const sectionText = await generateSectionText(model, section, topic, style, type, language, sectionWords);
        essayParts.push(`\n\f${sectionText}`);

        // Логируем информацию о подглаве
        if (section?.subSections?.length) {
            console.log(`🔍 Обрабатываем подглавы для раздела "${section.title}"`);
            for (const subSection of section.subSections) {
                if (!subSection?.title) {
                    console.warn("⚠️ Пропущена подглава без заголовка.");
                    continue;
                }

                const subRemainingWords = totalWords - allocatedWords;
                let subSectionWords = Math.min(
                    Math.round(sectionWords * (subSection.proportion || 0.3)),
                    subRemainingWords
                );

                if (subSectionWords <= 0) {
                    console.warn(`⚠️ Пропущена подглава ${subSection.title}, так как лимит достигнут.`);
                    continue;
                }
                allocatedWords += subSectionWords;

                const subSectionText = await generateSectionText(model, subSection, topic, style, type, language, subSectionWords);
                essayParts.push(`${subSectionText}`);
            }
        }
    }

    return essayParts.join("\n\n");
};