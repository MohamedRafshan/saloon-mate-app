import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { auth, db } from "../firebaseConfig";

function isRemotePushSupported(): boolean {
  if (!Device.isDevice) return false;
  if (Platform.OS === "android" && Constants.appOwnership === "expo")
    return false;
  return true;
}

export async function requestPushPermissions(): Promise<boolean> {
  if (!Device.isDevice) return false;
  const settings = await Notifications.getPermissionsAsync();
  let status = settings.status;
  if (status !== "granted") {
    const req = await Notifications.requestPermissionsAsync();
    status = req.status;
  }
  return status === "granted";
}

export async function getExpoPushToken(): Promise<string | null> {
  if (!isRemotePushSupported()) {
    if (__DEV__) {
      console.warn(
        "Remote push is unavailable in this runtime (e.g., Expo Go on Android)."
      );
    }
    return null;
  }
  const granted = await requestPushPermissions();
  if (!granted) return null;
  const token = (await Notifications.getExpoPushTokenAsync()).data;
  if (__DEV__) {
    console.log("Expo Push Token:", token);
  }
  return token;
}

export async function registerPushToken(): Promise<string | null> {
  try {
    const token = await getExpoPushToken();
    const user = auth.currentUser;
    if (token && user) {
      await db
        .collection("users")
        .doc(user.uid)
        .set(
          {
            pushToken: token,
            pushPlatform: Platform.OS,
            pushUpdatedAt: Date.now(),
          },
          { merge: true }
        );
      if (__DEV__) {
        console.log("Saved pushToken to Firestore for", user.uid, token);
      }
    }
    return token ?? null;
  } catch (e) {
    console.warn("Failed to register push token", e);
    return null;
  }
}

export function configureNotificationHandlers() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  // Android requires a notification channel for foreground notifications
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    }).catch(() => {});
  }
}

export function addNotificationListeners() {
  const subReceived = Notifications.addNotificationReceivedListener(() => {});
  const subResponse =
    Notifications.addNotificationResponseReceivedListener(() => {});
  return () => {
    subReceived.remove();
    subResponse.remove();
  };
}

export function canUseRemotePush(): boolean {
  return isRemotePushSupported();
}

export async function presentLocalNotification(
  title: string,
  body?: string,
  data?: Record<string, unknown>
): Promise<string> {
  return await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
    },
    trigger: null,
  });
}

export async function scheduleLocalNotification(
  title: string,
  body: string,
  secondsFromNow = 1,
  data?: Record<string, unknown>
): Promise<string> {
  return await Notifications.scheduleNotificationAsync({
    content: { title, body, data },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: secondsFromNow,
    },
  });
}

export async function sendPushNotification(
  to: string,
  title: string,
  body: string,
  data?: Record<string, unknown>
) {
  try {
    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ to, sound: "default", title, body, data }),
    });
  } catch (e) {
    console.warn("Failed to send push notification", e);
  }
}