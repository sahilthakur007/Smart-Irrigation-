import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  Dimensions,
} from "react-native";
import RNSpeedometer from "react-native-speedometer";
import { useState, useEffect, useRef } from "react";
// import * as Device from "expo-device";
// import * as Notifications from "expo-notifications";
import * as firebase from "firebase/app";
import { getDatabase, ref, onValue, update, set,push } from "firebase/database";

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

export default function MoistureContent({ route, navigation }) {
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

  const db = route.params.db;
  // console.log(db);
  const [moisture, setMoiture] = useState(0);
  const [isPumpOff, setisPumpOff] = useState(false);
  const [pumpSpeed, setPumpSpeed] = useState(0);
  const [pumpStatus, setPumpStatus] = useState("Pump off Manually");
  const handlePumpCondition = () => {
    if (isPumpOff) {
      setisPumpOff(false);

      //PUMP ON HERE
      set(ref(db, "/Pump Status"), false);

      set(ref(db, "/isOnManually"), true);
      set(ref(db, "/isOffManually"), false);
      setPumpStatus("Pump on Manually");

      // entries to pum table
      var hours = new Date().getHours(); //To get the Current Hours
      var min = new Date().getMinutes(); //To get the Current Minutes
      var sec = new Date().getSeconds();
      var d=new Date().getDate();
      var m=new Date().getMonth()+1;
      var y=new Date().getFullYear();
      push(ref(db, "/pumpData/date"),`${d} ${m} ${y}`);
      push(ref(db, "/pumpData/time"), `${hours}:${min}:${sec}`);
      push(ref(db, "/pumpData/status"), "Manually ON");
      // set(ref(db, "/pumpData/"), "Manually");

    } else {
      setisPumpOff(true);
      set(ref(db, "/Pump Status"), true);
      set(ref(db, "/isOffManually"), true);
      set(ref(db, "/isOnManually"), false);
      setPumpStatus("Pump off Manually");
      // PUMP OFF HERE

      // entries in pump table

      var hours = new Date().getHours(); //To get the Current Hours
      var min = new Date().getMinutes(); //To get the Current Minutes
      var sec = new Date().getSeconds();
      var d=new Date().getDate();
      var m=new Date().getMonth()+1;
      var y=new Date().getFullYear();
      push(ref(db, "/pumpData/date"),`${d} ${m} ${y}`);
      push(ref(db, "/pumpData/time"), `${hours}:${min}:${sec}`);
      push(ref(db, "/pumpData/status"), "Manually OFF");
      // set(ref(db, "/pumpData/"), "Manually");
    }
    // setSendNotification(true)
    // if (pumpStatus == "Pump off Manually") scheduleNotificationPumpOnManually();
    // else if (pumpStatus == "Pump on Manually") scheduleNotificationPumpOffManually();
  };

  useEffect(() => {
    let isOnManually;
    let isOffManually;

    onValue(ref(db, "/Moisture"), (querySnapShot) => {
      let data = querySnapShot.val();
      //  console.log(data)
      setMoiture(data);
    });
    // onValue(ref(db, '/isOffManually'), querySnapShot => {
    //   let isOffManually = querySnapShot.val()
    //   print(isOffManually)
    // })
    // onValue(ref(db, '/isOnManually'), querySnapShot => {
    //   let isOnManually = querySnapShot.val()
    //   print(isOnManually)
    // })
    onValue(ref(db, "/Pump Status"), (querySnapShot) => {
      let data = querySnapShot.val();
      // console.log(data)
      console.log("isoff = " + data);
      if (data == true) {
        setisPumpOff(true);
        onValue(ref(db, "/isOffManually"), (querySnapShot) => {
          let datav = querySnapShot.val();
          console.log("isOffManually = " + datav);
          if (datav == true) {
            setPumpStatus("Pump off Manually");
          } else {
            setPumpStatus("Pump off Automatically");
          }
        });
      } else {
        setisPumpOff(false);
        onValue(ref(db, "/isOnManually"), (querySnapShot) => {
          let datav = querySnapShot.val();
          console.log("isOnManually = " + datav);
          if (datav == true) {
            setPumpStatus("Pump on Manually");
          } else {
            setPumpStatus("Pump on Automatically");
          }
        });
      }
      // if (pumpStatus == "Pump off Automatically") scheduleNotificationPumpOnAutomatically();
      // else if (pumpStatus == "Pump on Automatically") scheduleNotificationPumpOffAutomatically();
    });

    onValue(ref(db, "/Motar speed"), (querySnapShot) => {
      let data = querySnapShot.val();
      console.log(data);
      if (data) setPumpSpeed(data);
      else setPumpSpeed(0);
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.outerbox1}>
        <View style={styles.div}>
          <Text style={styles.divText}>Present Moisture Level</Text>
        </View>
        <RNSpeedometer
          value={moisture}
          minValue={0}
          maxValue={100}
          size={Dimensions.get("window").width * 0.65}
          wrapperStyle={{ paddingTop: 30 }}
          labels={[{ name: "Lower Moisture Level", activeBarColor: "#81D37F" },
          { name: "Low Moisture Level", activeBarColor: "#48B645" },
          { name: "Medium Moisture Level", activeBarColor: "#20861C" },
          { name: "High Moisture Level", activeBarColor: "#146311" },
          { name: "Higher Moisture Level", activeBarColor: "#0D490B" }]}
        />
      </View>

      {/* textinput added temporarily for testing */}
      {/* <TextInput
          placeholder="Enter Speedometer Value"
          style={styles.textInput}
          onChangeText={(value) => setMeterValue(parseInt(value))}
        /> */}

      <Pressable style={styles.btn} onPress={handlePumpCondition}>
        <Text style={styles.btnText}>
          {isPumpOff ? "TURN ON PUMP" : "TURN OFF PUMP"}
        </Text>
      </Pressable>
      <View style={styles.outerbox2}>
        <View style={styles.div}>
          <Text style={styles.divText}>Current Pump Status</Text>
        </View>
        <View style={styles.div2}>
          <Text style={styles.divText2}>{pumpStatus}</Text>
        </View>
        {/* {!isPumpOff ? (
          <View style={styles.boxes}>
            <View style={styles.box1}>
              <Text style={{ fontSize: 20 }}>Pump Speed</Text>
            </View>
            <View style={styles.box2}>
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                {pumpSpeed}
              </Text>
            </View>
          </View>
        ) : null} */}
      </View>
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
    marginTop: Dimensions.get("window").height * 0.02,
    paddingTop: Dimensions.get("window").height * 0.015,
    paddingBottom: Dimensions.get("window").height * 0.16,
    backgroundColor: "white",
  },
  outerbox2: {
    borderWidth: 2,
    borderRadius: 8,
    borderColor: "grey",
    width: Dimensions.get("window").width * 0.9,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 0,
    marginTop: Dimensions.get("window").height * 0.005,
    paddingVertical: Dimensions.get("window").height * 0.015,
    backgroundColor: "white",
  },
  textInput: {
    height: 25,
    fontSize: 16,
    marginTop: 30,
    borderBottomWidth: 0.3,
    borderBottomColor: "black",
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
    marginVertical: Dimensions.get("window").height * 0.04,
  },
  btnText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  boxes: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 10,
    marginTop: 20,
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