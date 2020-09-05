import {useEffect} from "react";

import {
    askUserPermission,
    createNotificationSubscription,
    getUserSubscription,
    isPushNotificationSupported,
    registerServiceWorker,
    subscriptionToDb
} from "../notifications/push-notifications";

const pushNotificationSupported = isPushNotificationSupported();

export default function usePushNotifications(user) {

    useEffect(() => {
        if (pushNotificationSupported && user.user_id) {
            onRegisterPubSub(user)
        }
    }, [user]);

    const onRegisterPubSub = async (user) => {
        try {
            // đăng ký calendar service worker
            await registerServiceWorker()
            // xin quyen tu user
            const consent = await askUserPermission()
            if (consent === "granted") {
                // neu dong y
                // kiem tra thong tin cu da co
                let subscription = await getUserSubscription();
                if (!subscription) {
                    subscription = await createNotificationSubscription()
                }
                await subscriptionToDb(JSON.parse(JSON.stringify(subscription)), user.user_id)
            }

        } catch (e) {
            console.log(e);
        }
    }
}
