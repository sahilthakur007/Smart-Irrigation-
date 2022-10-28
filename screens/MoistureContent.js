import { StyleSheet, View, Text,  TextInput,  Pressable,  Dimensions,} from "react-native";
import RNSpeedometer from "react-native-speedometer";
import { useState ,useEffect} from "react";
import * as firebase from "firebase/app"
import { getDatabase, ref, onValue, update, set } from "firebase/database"

export default function MoistureContent({ route,navigation}) {

  const db = route.params.db

  const [moisture, setMoiture] = useState(0);
  const [isPumpOff, setisPumpOff] = useState(false);
  const [pumpSpeed,setPumpSpeed] = useState(0)
  const handlePumpCondition = () => {
  


    if (isPumpOff)
    {
      setisPumpOff(false)
      // setbuttonstext("OFF")
      set(ref(db, "/Pump Status"),false)
    
    }
    else
    {
      setisPumpOff(true)
      set(ref(db, "/Pump Status"), true)

      // setbuttonstext("ON")
    }
  };


  useEffect(() => {
    onValue(ref(db, '/Moisture'), querySnapShot => {
      let data = querySnapShot.val();
      //  console.log(data)
      setMoiture(data);


    })
    
    onValue(ref(db, '/Pump Status'), querySnapShot => {
      let data = querySnapShot.val() ;
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
      console.log(data)
        if(data)
          setPumpSpeed(data);
      else setPumpSpeed(0)
     

     
    })
    
  }, [])


  return (
    <View style={styles.container}>
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
      <View style={{ marginTop: 70, padding: 20 }}>
        {/* textinput added temporarily for testing */}
        <TextInput
          placeholder="Enter Speedometer Value"
          style={styles.textInput}
          onChangeText={(value) => setMeterValue(parseInt(value))}
        />

      <Pressable style={styles.btn} onPress={handlePumpCondition}>
        <Text style={styles.btnText}>
          {isPumpOff ? "TURN ON PUMP" : "TURN OFF PUMP"}
        </Text>
      </Pressable>
      </View>
      <View style={styles.div}>
        <Text style={styles.divText}>Current Pump Status</Text>
      </View>
      <View style={styles.div2}>
        <Text style={styles.divText2}>
          Currently pump is {!isPumpOff ? "ON\nPump Speed: "+pumpSpeed : "OFF"}
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
