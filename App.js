import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View ,Button, TextInput} from 'react-native';
import * as firebase from "firebase/app"
import {getDatabase,ref,onValue ,update,set} from "firebase/database"

import { firebaseConfig } from "./config"
export default function App() {
  const [moisture, setMoiture] = useState(0); 
  const [isoff, setisoff] = useState(true); 
  const [speed, setspeed] = useState(0)
  const [buttontext, setbuttonstext] = useState("ON");
  // if(!firebase.app.length)
  const app = firebase.initializeApp(firebaseConfig)
  const db = getDatabase(app)
  const handleChange = (event) =>
  {
    setspeed(event.target.value);
  }
  const handleClick = () => {
   
    if(isoff)
    { setisoff(false)
      setbuttonstext("OFF")
      set(ref(db, "/Pump Status"),false)
      // update(ref(db, '/'), {
        // Pump\status
      // });
    }
    else 
    {
      setisoff(true)
      set(ref(db, "/Pump Status"), true)

      // setbuttonstext("ON")
    }
  }
  useEffect(() => {
     onValue(ref(db, '/Moisture'), querySnapShot => {
       let data = querySnapShot.val() || {};
      //  console.log(data)
     setMoiture(data);
    
     })
    onValue(ref(db, '/Pump Status'), querySnapShot => {
      let data = querySnapShot.val() || {};
      // setisoff(data);

      console.log(data);
      if (data={}) {
        setisoff(false)
        setbuttonstext("OFF")
        // update(ref(db, '/'), {
        // Pump\status
        // });
      }
      else {
        setisoff(true)
        // set(ref(db, "/Pump Status"), true)

        setbuttonstext("ON")
      }
    })
    // console.log(moisturevalue)
  },[])
  return (
    <View style={styles.container}>
      <Text><h1>Smart Irrigation </h1></Text>
      <Text>Moiture:- {moisture} </Text>
      <Button onPress={handleClick} title={buttontext} style={{
      }}></Button>

      <TextInput keyboardType='numeric' name  = "motarspeed " value = {speed} placeholder='Enter speed of motar' onChange={handleChange}/>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
