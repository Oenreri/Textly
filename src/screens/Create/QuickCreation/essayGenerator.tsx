import { GEMINI_API_KEY } from '@env';
import { GoogleGenerativeAI } from '@google/generative-ai';

const wordsPerPage = 1800;

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

const createSectionPrompt = ({ topic, workType, language, sectionTitle, description, pages, comment, course, specialty, sectionWords }) => `
    Ты — профессиональный автор академических работ типа эссе, пишущий на языке **${language}**. Напиши раздел "${sectionTitle}" для работы типа **${workType}**.

    📌 **Тип работы:** ${workType}
    🔹 **Тема:** "${topic}"
    🔹 **Язык:** ${language}
    🔹 **Объем:** минимум ${sectionWords} символов (~${pages} страниц).
    🔹 **Формат:** ГОСТ и академический стиль.
    
    📖 **Требования к содержанию:** ${description || "Следуй академическим стандартам."}
    ${comment ? `💬 **Комментарий:** ${comment}` : ""}
    🔹 **Уровень написания:** ${course || "Не указан"}
    🔹 **Специальность:** ${specialty || "Не указана"}

    Напиши эссе, живой текст, c личными рассуждениями. НАПИШИ.
    НЕ ИСПОЛЬЗУЙ: В ЗАКЛЮЧЕНИИ, ТАКИМ ОБРАЗОМ, КРОМЕ ТОГО.! ЭТО ЭССЕ И В НЕЙ ВСЕГО ТРИ РАЗДЕЛА, ОНИ ВСЕ ДОЛЖНЫ БЫТЬ СВЯЗАННЫМИ.
    ПИШИ от местоимения "я"


    **Начни текст ниже:**  
`;

const generateContent = async (model, prompt) => {
    try {
        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
        });
        return (await result.response.text()).trim();
    } catch (error) {
        console.error("❌ Ошибка генерации:", error);
        return "";
    }
};

export const generateEssay = async ({ topic, pages, type, language, structure }) => {
    const model = createGenerativeModel();
    const totalWords = pages * wordsPerPage;
    let allocatedWords = 0;
    const essayParts = [];

    for (const section of structure) {
        if (!section.title) continue;
        const sectionWords = Math.min(Math.round(totalWords * 0.2), totalWords - allocatedWords);
        if (sectionWords <= 0) break;

        allocatedWords += sectionWords;
        const prompt = createSectionPrompt({ topic, type, language, sectionTitle: section.title, sectionWords });
        const sectionText = await generateContent(model, prompt);
        essayParts.push(`\n\f${sectionText}`);
    }

    return essayParts.join("\n\n");
};
