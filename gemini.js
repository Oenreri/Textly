const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

// Загружаем переменные окружения
const envPath = path.join(__dirname, ".env");
dotenv.config({ path: envPath });

// Проверяем API-ключ
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("❌ Ошибка: API_KEY не найден. Проверьте .env файл.");
    process.exit(1);
}

// Создаем экземпляр API
const genAI = new GoogleGenerativeAI(apiKey);

async function generateText() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = "Объясни теорию относительности простыми словами.";

        console.log("🔄 Отправляем запрос в API...");
        const result = await model.generateContent(prompt);

        // Проверяем наличие ответа
        if (!result || !result.response || !result.response.candidates || result.response.candidates.length === 0) {
            console.error("❌ Ошибка: Ответ API не содержит данных.");
            return;
        }

        console.log("✅ Ответ API получен. Обрабатываем...");

        // Корректное извлечение текста
        const contentParts = result.response.candidates[0]?.content?.parts;
        if (!contentParts || contentParts.length === 0) {
            console.error("❌ Ошибка: Ответ API пуст.");
            return;
        }

        const text = contentParts.map(part => part.text).join(" ");
        console.log("Ответ от ИИ:", text);
    } catch (error) {
        console.error("❌ Ошибка при вызове API:", error);
    }
}

generateText();
