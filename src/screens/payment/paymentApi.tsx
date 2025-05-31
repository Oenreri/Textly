import CryptoJS from "crypto-js";

const API_URL = "https://mw-api-test.dengi.kg/api/json/json.php";
const MERCHANT_PASSWORD = "96B&OYMC5@&@%&J"; // замените на ваш ключ
const SID = "0002794213"; // замените на ваш SID

const VERSION = 1005;
const LANG = "ru";

// Функция для генерации хеша HMAC-MD5
const generateHash = (jsonString, password) => {
    return CryptoJS.HmacMD5(jsonString, password).toString(CryptoJS.enc.Hex);
};

// Получаем OTP
const getOtp = async () => {
    try {
        const mktime = Math.floor(Date.now() / 1000).toString(); // секунды
;
        // Строим JSON запрос для получения OTP
        const requestOtp = {
            cmd: "getOTP",
            version: VERSION,
            sid: SID,
            mktime,
            lang: LANG,
            data: {
                return_url: null, // null как в примере
            }
        };

        // Строка для хэширования перед подписанием
        const jsonStringOtp = JSON.stringify(requestOtp);

        // Генерация хеша для OTP
        const hashOtp = generateHash(jsonStringOtp, MERCHANT_PASSWORD);

        // Добавление хеша в запрос
        requestOtp.hash = hashOtp;

        console.log("Запрос на получение OTP:", JSON.stringify(requestOtp, null, 2));

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=UTF-8", // Кодировка UTF-8
            },
            body: JSON.stringify(requestOtp),
        });

        const result = await response.json();
        console.log("Ответ от API для получения OTP:", result);

        if (result && result.data && result.data.otp) {
            console.log("Получен OTP:", result.data.otp);
            alert(`OTP код: ${result.data.otp}`);

            // После получения OTP отправляем запрос на его подтверждение
            confirmOtp(result.data.otp, mktime); // передаем актуальное время
        } else {
            console.log("Ошибка получения OTP", result);
            alert("Не удалось получить OTP.");
        }

        return result;
    } catch (error) {
        console.error("Ошибка при запросе OTP:", error);
        alert("Произошла ошибка при запросе OTP.");
        return null;
    }
};

const confirmOtp = async (otp, mktime) => {
    try {
        const requestConfirm = {
            cmd: "otpConfirm",
            version: VERSION,
            sid: SID,
            mktime,
            lang: LANG,
            data: {
                otp,
            }
        };

        const jsonStringConfirm = JSON.stringify(requestConfirm);
        const hashConfirm = generateHash(jsonStringConfirm, MERCHANT_PASSWORD);
        requestConfirm.hash = hashConfirm;

        console.log("Запрос на подтверждение OTP:", JSON.stringify(requestConfirm, null, 2));

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
            },
            body: JSON.stringify(requestConfirm),
        });

        const result = await response.json();
        console.log("Ответ от API для подтверждения OTP:", result);

        if (result && result.data && result.data.success) {
            alert("Оплата успешно подтверждена!");
        } else {
            console.log("Ошибка при подтверждении OTP", result);
            alert("Ошибка при подтверждении OTP.");
        }

        return result;
    } catch (error) {
        console.error("Ошибка при запросе подтверждения OTP:", error);
        alert("Произошла ошибка при подтверждении OTP.");
        return null;
    }
};

getOtp();
