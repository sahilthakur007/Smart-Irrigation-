import { View, Text, StyleSheet, Dimensions, Pressable } from "react-native";
import PureChart from 'react-native-pure-chart';
import { useEffect, useState } from "react";
import { getDatabase, ref, onValue, update, set } from "firebase/database"

export default function MoistureGraph({route,navigation}) {
const db = route.params.db
  console.log(db);
  const [moisturedata,setmoituredata] = useState([])
  useEffect(() => {
    onValue(ref(db, '/Moisture_Table'), querySnapShot => {
      let data = querySnapShot.val();
      console.log(data)
      let Date = [];
      let Day = [];
      let Time = [];
      let Moi = []
      for (const [key, value] of Object.entries(data.Date)) {
        // console.log(key, value);
        Date.push(value);
      }

      for (const [key, value] of Object.entries(data.Day)) {
        // console.log(key, value);
        Day.push(value);
      }
      for (const [key, value] of Object.entries(data.Time)) {
        // console.log(key, value);
        Time.push(value);
      }
      for (const [key, value] of Object.entries(data.Moisture)) {
        // console.log(key, value);
        Moi.push(value);
      }
      let alldata = []; 
      for (let i = 0; i < Day.length; i++)
      {
        const obj = {
          // x: Date[i],
          x: Time[i],
          y: Moi[i],
          
        }
        alldata.push(obj)
      }
      console.log(alldata)
      setmoituredata(alldata)
    })
  },[])
  return (
    <View style={styles.container}>
      <View style={styles.outerbox1}>
        <View style={styles.div}>
          <Text style={styles.divText}>Live Moisture Level</Text>
        </View>
       <PureChart data={moisturedata} type='line' width={50}/>
      </View>
      <Pressable style={styles.btn} onPress={()=>{navigation.navigate("moistureData")}}>
        <Text style={styles.btnText}>View Moisture Data</Text>
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
  div: {
    height: 40,
    width: Dimensions.get("window").width * 0.7,
    backgroundColor: "#D7E8D7",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    elevation: 12,
    marginBottom: 50
  },
  divText: {
    fontSize: 16,
  },
  btn: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderRadius: 20,
    elevation: 22,
    backgroundColor: "black",
    marginTop: 10,
  },
  btnText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
});
