import { useEffect, useState } from "react";
import { View, Text, Dimensions, StyleSheet,ScrollView } from "react-native";
import DataTable, { COL_TYPES } from "react-native-datatable-component";
import { ref, onValue } from "firebase/database";

export default function PumpSpeedTable({ route }) {
  const [pumpData, setPumpData] = useState([])
  const db = route.params.db
  useEffect(() => {
    onValue(ref(db, '/pumpData'), querySnapShot => {
      let data = querySnapShot.val();
      
      // console.log(data)
      // console.log(data)
      if (data!=null)
      {
        let Date = [];
        let Time = [];
        let Status = []
        for (const [key, value] of Object.entries(data.date)) {
          Date.push(value)
        }

        for (const [key, value] of Object.entries(data.time)) {
          // console.log(key, value);
          Time.push(value);
        }
        for (const [key, value] of Object.entries(data.status)) {
          // console.log(key, value);
          Status.push(value);
        }
        // console.log(Date)
        // console.log(Day)
        // console.log(Time)
        // console.log(Moi)
        let alldata = [];
        for (let i = 0; i < Date.length; i++) {
          // console.log(Date(Date[i]).toString());
          const obj = {
            Date: Date[i],
            Time: Time[i],
            Status: Status[i],

          }
          alldata.push(obj)
        }
        // console.log(alldata)
        setPumpData(alldata);
        }
    })

  }, [])
  return (
    <View style={styles.container}>
      <View style={styles.outerbox1}>
        <View style={styles.div}>
          <Text style={styles.divText}>Pump Duration Data</Text>
        </View>
        <View style={{ margin: 15, height: "auto" }}>
          <DataTable
            data={pumpData} // list of objects
            colNames={["Date","Time","Status"]} //List of Strings
            colSettings={[
              { name: "Date", type: COL_TYPES.STRING, width: "36%" },
              { name: "Time", type: COL_TYPES.INT, width: "30%" },
              { name: "Status", type: COL_TYPES.STRING, width: "34%" },
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
