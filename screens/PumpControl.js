import { View, Text, StyleSheet, Dimensions, Pressable } from "react-native";
import { useState, useEffect, useRef } from "react";
// import Slider from "@react-native-community/slider";
// import { Slider } from "react-native-range-slider-expo";
import * as Progress from "react-native-progress";
// import * as Device from "expo-device";
// import * as Notifications from "expo-notifications";
import { getDatabase, ref, onValue, update, set ,push} from "firebase/database"

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: false,
//     shouldSetBadge: false,
//   }),
// });

// async function scheduleNotificationPumpOnManually() {
//   await Notifications.scheduleNotificationAsync({
//     content: {
//       title: "Pump is ON",
//       body: "Pump is turned ON manually.",
//     },
//     trigger: { seconds: 1 },
//   });
// }
// async function scheduleNotificationPumpOffManually() {
//   await Notifications.scheduleNotificationAsync({
//     content: {
//       title: "Pump is OFF",
//       body: "Pump is turned OFF manually.",
//     },
//     trigger: { seconds: 1 },
//   });
// }
// async function scheduleNotificationPumpOnAutomatically() {
//   await Notifications.scheduleNotificationAsync({
//     content: {
//       title: "Pump is ON",
//       body: "Pump is turned ON automatically.",
//     },
//     trigger: { seconds: 1 },
//   });
// }
// async function scheduleNotificationPumpOffAutomatically() {
//   await Notifications.scheduleNotificationAsync({
//     content: {
//       title: "Pump is OFF",
//       body: "Pump is turned OFF automatically.",
//     },
//     trigger: { seconds: 1 },
//   });
// }
// async function scheduleNotificationWaterLevelLow() {
//   await Notifications.scheduleNotificationAsync({
//     content: {
//       title: "Water Level Alert",
//       body: "Water level in tank is low.",
//     },
//     trigger: { seconds: 1 },
//   });
// }

// async function registerForPushNotificationsAsync() {
//   let token;
//   if (Platform.OS === "android") {
//     await Notifications.setNotificationChannelAsync("default", {
//       name: "default",
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: "#FF231F7C",
//     });
//   }
//   if (Device.isDevice) {
//     const { status: existingStatus } =
//       await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;
//     if (existingStatus !== "granted") {
//       const { status } = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }
//     if (finalStatus !== "granted") {
//       alert(
//         "Turn on the notification permission from settings to get notifications."
//       );
//       return;
//     }
//     token = (await Notifications.getExpoPushTokenAsync()).data;
//     console.log(token);
//   } else {
//     alert("Must use physical device for Push Notifications");
//   }
//   return token;
// }

export default function PumpControl({ route, navigation }) {
  // const [sendNotification, setSendNotification]=useState(false)
  // const [expoPushToken, setExpoPushToken] = useState("");
  // const [notification, setNotification] = useState(false);
  // const notificationListener = useRef();
  // const responseListener = useRef();
  // useEffect(() => {
  //   registerForPushNotificationsAsync().then((token) =>
  //     setExpoPushToken(token)
  //   );
  //   notificationListener.current =
  //     Notifications.addNotificationReceivedListener((notification) => {
  //       setNotification(notification);
  //     });
  //   responseListener.current =
  //     Notifications.addNotificationResponseReceivedListener((response) => {
  //       console.log(response);
  //     });
  //   return () => {
  //     Notifications.removeNotificationSubscription(
  //       notificationListener.current
  //     );
  //     Notifications.removeNotificationSubscription(responseListener.current);
  //   };
  // }, []);


  // const [isPumpOff, setisPumpOff] = useState(true);
  const [pumpSpeed, setPumpSpeed] = useState(0);
  const [waterLevel, setWaterLevel] = useState(0.6);
  // const [pumpStatus, setPumpStatus] = useState("Pump Off Manually")

    const db = route.params.db
    
    useEffect(() => {

      onValue(ref(db, '/Pump Status'), querySnapShot => {
        let data = querySnapShot.val() || {};
        console.log(data)

        if (data == true) {
          route.params.setisPumpOff(true)
          onValue(ref(db, '/isOffManually'), querySnapShot => {
            let datav = querySnapShot.val();
            console.log("isOffManually = " + datav)
            if (datav == true) {
              route.params.setPumpStatus("Pump off Manually")

            }
            else {
              route.params.setPumpStatus("Pump off Automatically")
            }
          })

        }

        else {

          route.params.setisPumpOff(false)
          onValue(ref(db, '/isOnManually'), querySnapShot => {
            let datav = querySnapShot.val();
            console.log("isOnManually = " + datav)
            if (datav == true) {
              route.params.setPumpStatus("Pump on Manually")

            }
            else {
              route.params.setPumpStatus("Pump on Automatically")
            }
          })
        }
      })
      // if (pumpStatus == "Pump off Automatically") scheduleNotificationPumpOnAutomatically();
      // else if (pumpStatus == "Pump on Automatically") scheduleNotificationPumpOffAutomatically();
      onValue(ref(db, '/Motar speed'), querySnapShot => {
        let data = querySnapShot.val();
        console.log(data+" "+pumpSpeed)
        if (pumpSpeed==0)
          setPumpSpeed(data);
      })

      onValue(ref(db, '/waterLeval'), querySnapShot => {
        let data = querySnapShot.val();
        console.log(data + " " + pumpSpeed)
        setWaterLevel(data)
      })
      // if(waterLevel==0)
      //  scheduleNotificationWaterLevelLow();

    }, [route.params.isPumpOff])
  const handlePumpSpeed = (value) => {
    let speed = Math.round(value);
    console.log(speed);
    set(ref(db, "/Motar speed"), speed)
    setPumpSpeed(speed);
  };
  return (
    <View style={styles.container}>
      <View style={styles.outerbox1}>
        <View style={styles.div}>
          <Text style={styles.divText}>Current Pump Status</Text>
        </View>
        <View style={styles.div2}>
          <Text style={styles.divText2}>
            {route.params.pumpStatus}
          </Text>
        </View>
      </View>
      <Pressable style={styles.btn} onPress={route.params.handlePumpCondition} disabled = {waterLevel==0?true:false}>
        <Text style={styles.btnText}>
          {!route.params.isPumpOff ? "TURN OFF PUMP" : "TURN ON PUMP"}
        </Text>
      </Pressable>
      <View style={styles.outerbox1}>
        <View style={styles.div}>
          <Text style={styles.divText}>Current Water Level</Text>
        </View>
        <Progress.Bar
          progress={waterLevel/100}
          width={Dimensions.get("window").width * 0.5}
          height={Dimensions.get("window").height * 0.03}
          color={"grey"}
          style={styles.bar}
        />
        <View style={styles.boxes}>
          <View style={styles.box1}>
            <Text style={{ fontSize: 20 }}>Water Level</Text>
          </View>
          <View style={styles.box2}>
            <Text style={{ fontSize: 20,fontWeight: "bold" }}>{waterLevel}%</Text>
          </View>
        </View>
      </View>
      {/* <View style={styles.outerbox1}>
        <View style={styles.div}>
          <Text style={styles.divText}>Control Pump Speed</Text>
        </View>
        <Slider
          min={0}
          max={255}
          containerStyle={{ width: 300}}
          valueOnChange={handlePumpSpeed}
          initialValue={12}
          knobColor="green"
          valueLabelsBackgroundColor="black"
          inRangeBarColor="grey"
          outOfRangeBarColor="green"
          barHeight={8}
        />
        <View style={styles.boxes2}>
          <View style={styles.box1}>
            <Text style={{ fontSize: 20}}>Pump Speed</Text>
          </View>
          <View style={styles.box2}>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>{pumpSpeed}</Text>
          </View>
        </View>
      </View> */}
      <Pressable
        style={styles.btn}
        onPress={() => navigation.navigate("pumpSpeedData")}
      >
        <Text style={styles.btnText}>View Pump Data</Text>
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#E5E4DF",
    height: "100%",
  },
  outerbox1: {
    borderWidth: 2,
    borderRadius: 8,
    borderColor: "grey",
    width: Dimensions.get("window").width * 0.9,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 0,
    marginTop: Dimensions.get("window").height * 0.03,
    paddingVertical: Dimensions.get("window").height * 0.015,
    backgroundColor: "white",
  },
  div: {
    height:Dimensions.get("window").height * 0.06,
    width: Dimensions.get("window").width * 0.7,
    backgroundColor: "#D7E8D7",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    elevation: 12,
    marginTop: Dimensions.get("window").height * 0.01,
  },
  divText: {
    fontSize: Dimensions.get("window").height * 0.022,
  },
  div2: {
    height: "auto",
    width: Dimensions.get("window").width * 0.8,
    backgroundColor: "green",
    // borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Dimensions.get("window").height * 0.04,
    marginBottom: Dimensions.get("window").height * 0.015,
    padding: 8,
  },
  divText2: {
    fontSize: Dimensions.get("window").height * 0.026,
    color: "white",
  },
  btn: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Dimensions.get("window").height * 0.015,
    paddingHorizontal: Dimensions.get("window").width * 0.1,
    borderRadius: 20,
    elevation: 22,
    backgroundColor: "black",
    marginVertical: Dimensions.get("window").height * 0.03,
  },
  btnText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  bar: {
    marginTop: 20,
    marginBottom: 20,
  },
  boxes: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 10,
  },
  boxes2: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 5,
    marginTop: 100,
  },
  box1: {
    alignItems: "center",
    justifyContent: "center",
    borderColor: "black",
    paddingHorizontal: 20,
    borderWidth: 1,
    borderRadius: 10,
    marginHorizontal: 15,
    backgroundColor: "#E5E4DF",
    elevation: 4,
  },
  box2: {
    alignItems: "center",
    justifyContent: "center",
    borderColor: "black",
    paddingHorizontal: 20,
    borderWidth: 1,
    borderRadius: 10,
    marginHorizontal: 20,
  },
});