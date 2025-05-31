import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database'; // Импортируем getDatabase для работы с Realtime Database

// Конфигурация Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDDJv4hjK98zSPq7iBCU7ZBrSGLba21Ksk",
    authDomain: "textly-7b1e8.firebaseapp.com",
    projectId: "textly-7b1e8",
    storageBucket: "textly-7b1e8.appspot.com",
    messagingSenderId: "415921341650",
    appId: "1:415921341650:android:e1490e32698c529888d90b",
    databaseURL: "https://textly-7b1e8-default-rtdb.firebaseio.com/" // Добавьте это!
};


// Проверяем, был ли Firebase уже инициализирован
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app); // Инициализация Firestore
const rtdb = getDatabase(app); // Инициализация Realtime Database

// ⚡ Гарантированно передаём AsyncStorage
let auth;
try {
    auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
    });
} catch (error) {
    console.log("⚠️ Firebase Auth уже инициализирован, используем getAuth()");
    auth = getAuth(app);
}

// Экспортируем модули
export { app, auth, db, rtdb }; // Экспортируем и Realtime Database как rtdb
