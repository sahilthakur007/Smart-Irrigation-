import { View, Text, StyleSheet, Dimensions, Pressable } from "react-native";
import { useState, useEffect, useRef } from "react";
import * as Progress from "react-native-progress";
import * as Notifications from "expo-notifications";
import { getDatabase, ref, onValue, update, set ,push} from "firebase/database"
import { useSelector, useDispatch } from "react-redux";
import { updatePumpCondition } from "../Redux/Action/pumpSatus";
import * as notify from "../Notifications/notifications";

export default function PumpControl({ route, navigation }) {
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
        console.log(response);
      });
    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);


  // const [isPumpOff, setisPumpOff] = useState(true);
  const dispatch = useDispatch()
  const { pumpStatus, isPumpOff } = useSelector((state) => state.pumpStateReducer)

  const [pumpSpeed, setPumpSpeed] = useState(0);
  const [waterLevel, setWaterLevel] = useState(0.6);
  // const [pumpStatus, setPumpStatus] = useState("Pump Off Manually")

  const db = route.params.db
  // const [pumpStatus, setPumpStatus] = useState("Pump off Manually");
  // const [isPumpOff, setisPumpOff] = useState(false);
  
  const handlePumpCondition = () => {
    // console.log(message)
    console.log(isPumpOff)
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
      dispatch(updatePumpCondition("Pump on Manually", false))
      // set(ref(db, "/pumpData/"), "Manually");

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
      dispatch(updatePumpCondition("Pump off Manually", true))
      // set(ref(db, "/pumpData/"), "Manually");
    }

  
    setSendNotification(true)
    if (pumpStatus == "Pump off Manually") notify.scheduleNotificationPumpOnManually();
    else if (pumpStatus == "Pump on Manually") notify.scheduleNotificationPumpOffManually();
  };
    useEffect(() => {
      // console.log(`status ${handlePumpCondition}`)
      onValue(ref(db, '/Pump Status'), querySnapShot => {
        let data = querySnapShot.val() || {};
        // console.log(data)

        if (data == true) {

          // setisPumpOff(true)
          onValue(ref(db, '/isOffManually'), querySnapShot => {
            let datav = querySnapShot.val();
            // console.log("isOffManually = " + datav)
            if (datav == true) {
              // setPumpStatus("Pump off Manually")
              dispatch(updatePumpCondition("Pump off Manually", true))

            }
            else {
              // setPumpStatus("Pump off Automatically")
              dispatch(updatePumpCondition("Pump off Automatically", true))

            }
          })

        }

        else {

          // setisPumpOff(false)
          onValue(ref(db, '/isOnManually'), querySnapShot => {
            let datav = querySnapShot.val();
            // console.log("isOnManually = " + datav)
            if (datav == true) {
              // setPumpStatus("Pump on Manually")
              dispatch(updatePumpCondition("Pump on Manually", false))

            }
            else {
              // setPumpStatus("Pump on Automatically")
              dispatch(updatePumpCondition("Pump on Automatically", false))

            }
          })
        }
      })
      if (pumpStatus == "Pump off Automatically") notify.scheduleNotificationPumpOnAutomatically();
      else if (pumpStatus == "Pump on Automatically") notify.scheduleNotificationPumpOffAutomatically();
      onValue(ref(db, '/Motar speed'), querySnapShot => {
        let data = querySnapShot.val();
        // console.log(data+" "+pumpSpeed)
        if (pumpSpeed==0)
          setPumpSpeed(data);
      })

      onValue(ref(db, '/waterLeval'), querySnapShot => {
        let data = querySnapShot.val();
        // console.log(data + " " + pumpSpeed)
        setWaterLevel(data)
      })
      if(waterLevel==0)
       notify.scheduleNotificationWaterLevelLow();

    }, [])
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
            {pumpStatus}
          </Text>
        </View>
      </View>
      <Pressable style={styles.btn} onPress={ handlePumpCondition} disabled = {waterLevel==0?true:false}>
        <Text style={styles.btnText}>
          {!isPumpOff ? "TURN OFF PUMP" : "TURN ON PUMP"}
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