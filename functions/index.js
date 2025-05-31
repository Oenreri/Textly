const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");

admin.initializeApp();

const YOOMONEY_SHOP_ID = "your_shop_id";
const YOOMONEY_SECRET = "your_secret_key";

// Функция для создания платежа
exports.createPayment = functions.https.onRequest(async (req, res) => {
    try {
        const { userId, amount } = req.body;
        const paymentData = {
            amount: { value: amount, currency: "RUB" },
            confirmation: { type: "redirect", return_url: "myapp://payment-success" },
            capture: true,
            description: "Оплата подписки",
        };

        const response = await axios.post("https://api.yookassa.ru/v3/payments", paymentData, {
            auth: { username: YOOMONEY_SHOP_ID, password: YOOMONEY_SECRET },
            headers: { "Content-Type": "application/json" },
        });

        const confirmationUrl = response.data.confirmation.confirmation_url;

        // Сохраняем платеж в Firebase
        await admin.database().ref(`payments/${userId}`).set({
            paymentId: response.data.id,
            status: "pending",
            amount: amount,
            createdAt: Date.now(),
        });

        res.json({ confirmationUrl });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Вебхук для обработки успешных платежей
exports.paymentWebhook = functions.https.onRequest(async (req, res) => {
    const payment = req.body;

    if (payment.event === "payment.succeeded") {
        const paymentId = payment.object.id;
        const snapshot = await admin.database().ref("payments").orderByChild("paymentId").equalTo(paymentId).once("value");
        const paymentData = snapshot.val();

        if (paymentData) {
            const userId = Object.keys(paymentData)[0];

            await admin.database().ref(`users/${userId}`).update({
                subscription: "full",
                subscriptionExpiry: Date.now() + 30 * 24 * 60 * 60 * 1000,
            });

            await admin.database().ref(`payments/${userId}`).update({
                status: "success",
            });

            res.status(200).send("OK");
        } else {
            res.status(400).send("User not found");
        }
    } else {
        res.status(400).send("Invalid event");
    }
});
