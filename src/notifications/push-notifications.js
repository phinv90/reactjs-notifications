// import {db} from '../firebaseConfig' // config setup your firebase
// import {CALENDAR_COLLECTION} from "../config/constants"; // collectiton name
// import firebase from "firebase/app";

const pushServerPublicKey = "your key";

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}


function isPushNotificationSupported() {
    return "serviceWorker" in navigator && "PushManager" in window;
}

async function askUserPermission() {
    return await Notification.requestPermission();
}


function registerServiceWorker() {
    return navigator.serviceWorker.register("/calendar-service-worker.js");
}

/**
 *
 * using the registered service worker creates a push notification subscription and returns it
 *
 */
async function createNotificationSubscription() {
    //wait for service worker installation to be ready
    const serviceWorker = await navigator.serviceWorker.ready;
    // subscribe and return the subscription
    return await serviceWorker.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(pushServerPublicKey)
    });
}


function getUserSubscription() {
    //wait for service worker installation to be ready, and then
    return navigator.serviceWorker.ready
        .then(function (serviceWorker) {
            return serviceWorker.pushManager.getSubscription();
        })
        .then(function (pushSubscription) {
            return pushSubscription;
        });
}

async function subscriptionToDb(sub, userId) {
    // const userRef = db.doc(`${CALENDAR_COLLECTION}/${userId}`)
    // await userRef.set({
    //     subscriptions: firebase.firestore.FieldValue.arrayUnion(sub)
    // }, {merge: true})
}

async function subscribeUserToPush(user) {
    try {
        const registration = await navigator.serviceWorker.register('/calendar-service-worker.js')

        let sub = await registration.pushManager.getSubscription()
    } catch (e) {

    }

}

export {
    isPushNotificationSupported,
    askUserPermission,
    registerServiceWorker,
    createNotificationSubscription,
    getUserSubscription,
    subscriptionToDb,
    subscribeUserToPush
};
