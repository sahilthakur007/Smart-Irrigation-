import { useEffect, useState } from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import DataTable, { COL_TYPES } from "react-native-datatable-component";
import { getDatabase, ref, onValue, update, set } from "firebase/database"
export default function PumpSpeedTable({route}) {
  const db = route.params.db
  console.log(db);
  const [moisturedata,setmoituredata] = useState([])
  useEffect(() => {
    onValue(ref(db, '/Moisture_Table'), querySnapShot => {
      let data = querySnapShot.val();
      if (data)
      {
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
        // console.log(Date)
        // console.log(Day)
        // console.log(Time)
        // console.log(Moi)
        let alldata = [];
        for (let i = 0; i < Day.length; i++) {
          const obj = {
            Date: Date[i],
            Time: Time[i],
            Moisture: Moi[i],

          }
          alldata.push(obj)
        }
        console.log(alldata)
        setmoituredata(alldata)
        }
    })
  },[])
  return (
    <View style={styles.container}>
      <View style={styles.outerbox1}>
        <View style={styles.div}>
          <Text style={styles.divText}>Moisture Data</Text>
        </View>
        <View style={{ margin: 15, height: "auto" }}>
          <DataTable
            data={moisturedata} // list of objects
            colNames={["Date","Time","Moisture"]} //List of Strings
            colSettings={[
              { name: "Date", type: COL_TYPES.STRING, width: "40%" },
              { name: "Time", type: COL_TYPES.STRING, width: "30%" },
              { name: "Moisture", type: COL_TYPES.INT, width: "30%" },
            ]} //List of Objects
            noOfPages={1} //number
            backgroundColor={"white"} //Table Background Color
            headerLabelStyle={{ color: "green", fontSize: 16 }} //Text Style Works
          />
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
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "grey",
    width: Dimensions.get("window").width * 0.96,
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
    marginTop: 36
  },
  divText: {
    fontSize: 16,
  },
});