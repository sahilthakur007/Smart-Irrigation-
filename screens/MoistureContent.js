import { StyleSheet, View, Text,  TextInput,  Pressable,  Dimensions,} from "react-native";
import RNSpeedometer from "react-native-speedometer";
import { useState } from "react";

export default function MoistureContent({ navigation }) {
  const [meterValue, setMeterValue] = useState(20);
  const [isPumpOn, setisPumpOn] = useState(false);
  const handlePumpCondition = () => {
    setisPumpOn((prevState) => !prevState);
  };
  return (
    <View style={styles.container}>
      <View style={styles.div}>
        <Text style={styles.divText}>Present Moisture Level</Text>
      </View>
      <RNSpeedometer
        value={meterValue}
        minValue={0}
        maxValue={100}
        size={250}
        wrapperStyle={{ paddingTop: 30 }}
        //   labels={[
        //     {
        //       name: 'Low Risk',
        //       labelColor: '#ff2900',
        //       activeBarColor: '#ff2900',
        //     },
        //     {
        //       name: 'Medium Risk',
        //       labelColor: '#f4ab44',
        //       activeBarColor: '#f4ab44',
        //     },
        //     {
        //       name: 'High Risk',
        //       labelColor: '#00ff6b',
        //       activeBarColor: '#00ff6b',
        //     },
        //   ]}
        labels={[{ name: "level", activeBarColor: "green" }]}
      />
      <View style={{ marginTop: 70, padding: 20 }}>
        {/* textinput added temporarily for testing */}
        <TextInput
          placeholder="Enter Speedometer Value"
          style={styles.textInput}
          onChangeText={(value) => setMeterValue(parseInt(value))}
        />

      <Pressable style={styles.btn} onPress={handlePumpCondition}>
        <Text style={styles.btnText}>
          {isPumpOn ? "TURN OFF PUMP" : "TURN ON PUMP"}
        </Text>
      </Pressable>
      </View>
      <View style={styles.div}>
        <Text style={styles.divText}>Current Pump Status</Text>
      </View>
      <View style={styles.div2}>
        <Text style={styles.divText2}>
          Currently pump is {isPumpOn ? "ON\nPump Speed: " : "OFF"}
        </Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  textInput: {
    height: 25,
    fontSize: 16,
    marginTop: 30,
    borderBottomWidth: 0.3,
    borderBottomColor: "black",
  },
  btn: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 20,
    elevation: 8,
    backgroundColor: "black",
    marginTop: 20,
    marginBottom: 30,
  },
  btnText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
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
});
