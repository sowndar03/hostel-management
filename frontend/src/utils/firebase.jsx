import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_WEB_PUSH_API_KEY,
    authDomain: import.meta.env.VITE_WEB_PUSH_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_WEB_PUSH_PROJECT_ID,
    storageBucket: import.meta.env.VITE_WEB_PUSH_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_WEB_PUSH_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_WEB_PUSH_APPID,
    measurementId: import.meta.env.VITE_WEB_PUSH_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const messaging = getMessaging(app);

export const requestForToken = async () => {
    try {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            console.warn('Notification permission not granted');
            return null;
        }

        const token = await getToken(messaging, { vapidKey: import.meta.env.VITE_WEB_PUSH_VAPIDKEY });
        if (token) {
            return token;
        } else {
            console.log("No registration token available.");
        }
    } catch (err) {
        console.error("An error occurred while retrieving token. ", err);
    }
};

export const onMessageListener = () =>
    new Promise((resolve) => {
        onMessage(messaging, (payload) => {
            resolve(payload);
        });
    });
