import { View, Text, StyleSheet, Dimensions, Pressable } from "react-native";
import { useState,useEffect } from "react";
import Slider from "@react-native-community/slider";
import { getDatabase, ref, onValue, update, set } from "firebase/database"

export default function PumpControl({route}) {
  const [isPumpOff, setisPumpOff] = useState(true);
  const [pumpSpeed, setPumpSpeed] = useState(0)
  const db = route.params.db
  const handlePumpCondition = () => {
    
    if (isPumpOff) {
      setisPumpOff(false)
      set(ref(db, "/Pump Status"), false)

    }
    else {
      setisPumpOff(true)
      set(ref(db, "/Pump Status"), true)
    }
    setPumpSpeed(0);
  };
  useEffect(() => {
  

    onValue(ref(db, '/Pump Status'), querySnapShot => {
      let data = querySnapShot.val() || {};
      console.log(data)


      if (data == true) {
        setisPumpOff(true)

      }
      else {
        setisPumpOff(false)
      }
    })

    onValue(ref(db, '/Motar speed'), querySnapShot => {
      let data = querySnapShot.val();
      console.log(data+" "+pumpSpeed)
      if (pumpSpeed==0)
        setPumpSpeed(data);
    })

  }, [isPumpOff])
  const handlePumpSpeed = (value) => {
    let speed = Math.round(value)
    console.log(speed);
    set(ref(db, "/Motar speed"), speed)
    setPumpSpeed(speed);
     
    
 }
  return (
    <View style={styles.container}>
      <View style={styles.div}>
        <Text style={styles.divText}>Current Pump Status</Text>
      </View>
      <View style={styles.div2}>
        <Text style={styles.divText2}>
          Currently pump is {!isPumpOff ? "ON\nPump Speed: "+pumpSpeed : "OFF"}
        </Text>
      </View>
      <Pressable style={styles.btn} onPress={handlePumpCondition}>
        <Text style={styles.btnText}>
          {!isPumpOff ? "TURN OFF PUMP" : "TURN ON PUMP"}
        </Text>
      </Pressable>
      <View style={styles.div}>
        <Text style={styles.divText}>Control Pump Speed</Text>
      </View>

      <Slider
        style={{width: 300, height:100}}
        minimumValue={0}
        maximumValue={255}
        minimumTrackTintColor="green"
        maximumTrackTintColor="grey"
        thumbTintColor="green"
        value={pumpSpeed}
        onValueChange={handlePumpSpeed}
        disabled={!isPumpOff? false: true}
      />
      <Text style={{fontSize: 22,marginTop: 0}}>Pump Speed: {pumpSpeed} </Text>
      <Pressable style={styles.btn}>
        <Text style={styles.btnText}>View Pump Duration Data</Text>
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  div: {
    height: 40,
    width: Dimensions.get("window").width * 0.9,
    backgroundColor: "#D7E8D7",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  divText: {
    fontSize: 16,
  },
  div2: {
    height: "auto",
    width: Dimensions.get("window").width,
    backgroundColor: "green",
    // borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    padding: 8,
  },
  divText2: {
    fontSize: 20,
    color: "white",
  },
  btn: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 20,
    elevation: 8,
    backgroundColor: "black",
    marginTop: 40,
    marginBottom: 30,
  },
  btnText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
});
