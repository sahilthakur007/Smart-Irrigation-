import { View, Text, StyleSheet, Dimensions, Pressable } from "react-native";
import { useState } from "react";
import Slider from "@react-native-community/slider";

export default function PumpControl() {
  const [isPumpOn, setisPumpOn] = useState(true);
  const [pumpSpeed, setPumpSpeed]= useState(0)
  const handlePumpCondition = () => {
    setisPumpOn((prevState) => !prevState);
    setPumpSpeed(0);
  };
  return (
    <View style={styles.container}>
      <View style={styles.div}>
        <Text style={styles.divText}>Current Pump Status</Text>
      </View>
      <View style={styles.div2}>
        <Text style={styles.divText2}>
          Currently pump is {isPumpOn ? "ON\nPump Speed: " : "OFF"}
        </Text>
      </View>
      <Pressable style={styles.btn} onPress={handlePumpCondition}>
        <Text style={styles.btnText}>
          {isPumpOn ? "TURN OFF PUMP" : "TURN ON PUMP"}
        </Text>
      </Pressable>
      <View style={styles.div}>
        <Text style={styles.divText}>Control Pump Speed</Text>
      </View>

      <Slider
        style={{width: 300, height:100}}
        minimumValue={0}
        maximumValue={1}
        minimumTrackTintColor="green"
        maximumTrackTintColor="grey"
        thumbTintColor="green"
        value={pumpSpeed/100}
        onValueChange={(value)=>{setPumpSpeed(value*100)}}
        disabled={isPumpOn? false: true}
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
