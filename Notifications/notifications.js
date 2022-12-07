import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

export default Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function scheduleNotificationPumpOnManually() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Pump is ON",
      body: "Pump is turned ON manually.",
    },
    trigger: { seconds: 1 },
  });
}
export async function scheduleNotificationPumpOffManually() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Pump is OFF",
      body: "Pump is turned OFF manually.",
    },
    trigger: { seconds: 1 },
  });
}
export async function scheduleNotificationPumpOnAutomatically() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Pump is ON",
      body: "Pump is turned ON automatically.",
    },
    trigger: { seconds: 1 },
  });
}
export async function scheduleNotificationPumpOffAutomatically() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Pump is OFF",
      body: "Pump is turned OFF automatically.",
    },
    trigger: { seconds: 1 },
  });
}
export async function scheduleNotificationWaterLevelLow() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Water Level Alert",
      body: "Water level in tank is low.",
    },
    trigger: { seconds: 1 },
  });
}

export async function registerForPushNotificationsAsync() {
  let token;
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert(
        "Turn on the notification permission from settings to get notifications."
      );
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    alert("Must use physical device for Push Notifications");
  }
  return token;
}
