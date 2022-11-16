import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  Dimensions,
} from "react-native";
import RNSpeedometer from "react-native-speedometer";
import { useState, useEffect } from "react";
import * as firebase from "firebase/app"
import { getDatabase, ref, onValue, update, set } from "firebase/database"

export default function MoistureContent({ route, navigation }) {
  const db = route.params.db
  // console.log(db);
  const [moisture, setMoiture] = useState(0);
  const [isPumpOff, setisPumpOff] = useState(false);
  const [pumpSpeed, setPumpSpeed] = useState(0);
  const [pumpStatus, setPumpStatus] =useState("Pump Off Manually")
  const handlePumpCondition = () => {
    if (isPumpOff) {
      setisPumpOff(false);
      
      //PUMP ON HERE 
      set(ref(db, "/Pump Status"), false)
     
      set(ref(db, "/isOnManually"), true)
      set(ref(db, "/isOffManually"), false)
      setPumpStatus("Pump on Manually")


    } else {
      setisPumpOff(true);
      set(ref(db, "/Pump Status"), true)
      set(ref(db, "/isOffManually"), true)
      set(ref(db, "/isOnManually"), false)
      setPumpStatus("Pump off Manually")
        // PUMP OFF HERE 
      
    }
  };

  useEffect(() => {
    let isOnManually; 
    let isOffManually;

    onValue(ref(db, '/Moisture'), querySnapShot => {
      let data = querySnapShot.val();
      //  console.log(data)
      setMoiture(data);

    })
    // onValue(ref(db, '/isOffManually'), querySnapShot => {
    //   let isOffManually = querySnapShot.val()
    //   print(isOffManually)
    // })
    // onValue(ref(db, '/isOnManually'), querySnapShot => {
    //   let isOnManually = querySnapShot.val()
    //   print(isOnManually)
    // })
    onValue(ref(db, '/Pump Status'), querySnapShot => {
      let data = querySnapShot.val() ;
      // console.log(data)
      console.log("isoff = "+data)
      if (data == true) {
        setisPumpOff(true)
        onValue(ref(db, '/isOffManually'), querySnapShot => {
          let datav = querySnapShot.val();
          console.log("isOffManually = "+datav)
          if (datav==true)
          {
            setPumpStatus("Pump off Manually")
            
          }
          else {
            setPumpStatus("Pump off Automatically")
          }
        })

      }
      
      else {
        
        setisPumpOff(false)
        onValue(ref(db, '/isOnManually'), querySnapShot => {
          let datav = querySnapShot.val();
          console.log("isOnManually = " + datav)
          if (datav==true) {
            setPumpStatus("Pump on Manually")

          }
          else {
            setPumpStatus("Pump on Automatically")
          }
        })
      }
    })

    onValue(ref(db, '/Motar speed'), querySnapShot => {
      let data = querySnapShot.val();
      console.log(data)
        if(data)
          setPumpSpeed(data);
      else setPumpSpeed(0)

    })

  }, [])

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
          size={250}
          wrapperStyle={{ paddingTop: 30 }}
          labels={[{ name: "level", activeBarColor: "green" }]}
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
          <Text style={styles.divText2}>
           { pumpStatus}
          </Text>
        </View>
        {!isPumpOff ? (
          <View style={styles.boxes}>
            <View style={styles.box1}>
              <Text style={{ fontSize: 20 }}>Pump Speed</Text>
            </View>
            <View style={styles.box2}>
              <Text style={{ fontSize: 20,fontWeight: "bold" }}>{pumpSpeed}</Text>
            </View>
          </View>
        ) : null}
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
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "grey",
    width: Dimensions.get("window").width * 0.9,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 0,
    marginTop: 10,
    paddingTop: 12,
    paddingBottom: 114,
    backgroundColor: "white",
  },
  outerbox2: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "grey",
    width: Dimensions.get("window").width * 0.9,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 0,
    marginTop: 10,
    paddingVertical: 12,
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
    height: 40,
    width: Dimensions.get("window").width * 0.7,
    backgroundColor: "#D7E8D7",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    elevation: 15,
  },
  divText: {
    fontSize: 16,
  },
  div2: {
    height: "auto",
    width: Dimensions.get("window").width * 0.8,
    backgroundColor: "green",
    // borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    padding: 8,
  },
  divText2: {
    fontSize: 20,
    color: "white",
  },
  btn: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderRadius: 20,
    elevation: 22,
    backgroundColor: "black",
    marginVertical: 20,
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
    backgroundColor: "#E5E4DF"
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
