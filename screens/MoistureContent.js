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
import * as Notifications from "expo-notifications";
import * as firebase from "firebase/app";
import { getDatabase, ref, onValue, update, set,push } from "firebase/database";
import { useSelector, useDispatch } from "react-redux";
import { updatePumpCondition } from "../Redux/Action/pumpSatus";
import * as notify from "../Notifications/notifications";

export default function MoistureContent({ route, navigation }) {
  const [sendNotification, setSendNotification]=useState(false)
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  useEffect(() => {
    notify.registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
      });
    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const db = route.params.db;
  // console.log(db);
  const [moisture, setMoiture] = useState(0);
  // const [isPumpOff, setisPumpOff] = useState(false);
  const [pumpSpeed, setPumpSpeed] = useState(0);
  // const [pumpStatus, setPumpStatus] = useState("Pump off Manually");

  const dispatch = useDispatch()
  const { pumpStatus, isPumpOff } = useSelector((state) => state.pumpStateReducer)

  // const [pumpStatus, setPumpStatus] = useState("Pump off Manually");
  // const [isPumpOff, setisPumpOff] = useState(false);

  const handlePumpCondition = () => {
    // console.log(message)
    // console.log("yes")
    if (isPumpOff) {
      // setisPumpOff(false);

      //PUMP ON HERE
      set(ref(db, "/Pump Status"), false);

      set(ref(db, "/isOnManually"), true);
      set(ref(db, "/isOffManually"), false);
      // setPumpStatus("Pump on Manually");
      // entries to pum table
      var myDate= new Date();
      var myDateString = ('0'+myDate.getDate()).slice(-2)+' '
      + ('0'+ (myDate.getMonth()+1)).slice(-2)+' '+ myDate.getFullYear();
      var myTimeString = ('0'+myDate.getHours()).slice(-2)+':'
      + ('0'+ (myDate.getMinutes())).slice(-2)+':'+('0'+ (myDate.getSeconds())).slice(-2);
      push(ref(db, "/pumpData/date"), myDateString);
      push(ref(db, "/pumpData/time"), myTimeString);
      push(ref(db, "/pumpData/status"), "Manually ON");
      // set(ref(db, "/pumpData/"), "Manually");
      dispatch(updatePumpCondition("Pump on Manually", false))


    } else {

      // setisPumpOff(true);
      set(ref(db, "/Pump Status"), true);
      set(ref(db, "/isOffManually"), true);
      set(ref(db, "/isOnManually"), false);
      // setPumpStatus("Pump off Manually");
      // PUMP OFF HERE

      // entries in pump table

      var myDate= new Date();
      var myDateString = ('0'+myDate.getDate()).slice(-2)+' '
      + ('0'+ (myDate.getMonth()+1)).slice(-2)+' '+ myDate.getFullYear();
      var myTimeString = ('0'+myDate.getHours()).slice(-2)+':'
      + ('0'+ (myDate.getMinutes())).slice(-2)+':'+('0'+ (myDate.getSeconds())).slice(-2);
      push(ref(db, "/pumpData/date"), myDateString);
      push(ref(db, "/pumpData/time"), myTimeString);
      push(ref(db, "/pumpData/status"), "Manually OFF");
      // set(ref(db, "/pumpData/"), "Manually");
      dispatch(updatePumpCondition("Pump off Manually", true))

    }

    setSendNotification(true)
    if (pumpStatus == "Pump off Manually") notify.scheduleNotificationPumpOnManually();
    else if (pumpStatus == "Pump on Manually") notify.scheduleNotificationPumpOffManually();
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
        // setisPumpOff(true);
        onValue(ref(db, "/isOffManually"), (querySnapShot) => {
          let datav = querySnapShot.val();
          console.log("isOffManually = " + datav);
          if (datav == true) {
          //  setPumpStatus("Pump off Manually");
            dispatch(updatePumpCondition("Pump off Manually", true))
          } else {
            // setPumpStatus("Pump off Automatically");
            dispatch(updatePumpCondition("Pump off Automatically", true))

          }
        });
      } else {
        // setisPumpOff(false);
        onValue(ref(db, "/isOnManually"), (querySnapShot) => {
          let datav = querySnapShot.val();
          console.log("isOnManually = " + datav);
          if (datav == true) {
            // setPumpStatus("Pump on Manually");
            dispatch(updatePumpCondition("Pump on Manually", false))

          } else {
            // setPumpStatus("Pump on Automatically");
            dispatch(updatePumpCondition("Pump on Automatically", false))

          }
        });
      }
      if (pumpStatus == "Pump off Automatically") notify.scheduleNotificationPumpOnAutomatically();
      else if (pumpStatus == "Pump on Automatically") notify.scheduleNotificationPumpOffAutomatically();
    });

    onValue(ref(db, "/Motar speed"), (querySnapShot) => {
      let data = querySnapShot.val();
      // console.log(data);
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