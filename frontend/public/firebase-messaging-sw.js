importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyBsyEmZlWGF61uUP5bBRzeaewcHtYpuu3c",
    authDomain: "hostel-management-a649d.firebaseapp.com",
    projectId: "hostel-management-a649d",
    messagingSenderId: "627703004375",
    appId: "1:627703004375:web:a840b99a4d8bd8a37c8492",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    self.registration.showNotification(payload.notification.title, {
        body: payload.notification.body,
        icon: '/icon.png',
    });
});
