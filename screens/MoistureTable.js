import { View, Text, Dimensions, StyleSheet } from "react-native";
import DataTable, { COL_TYPES } from "react-native-datatable-component";

export default function PumpSpeedTable() {
  return (
    <View style={styles.container}>
      <View style={styles.outerbox1}>
        <View style={styles.div}>
          <Text style={styles.divText}>Moisture Data</Text>
        </View>
        <View style={{ margin: 15, height: "auto" }}>
          <DataTable
            data={[
              {"Date": "03/11/22","Time":"05:34:02", "Number of hours": 5},
              {"Date": "03/11/22","Time":"05:34:02", "Number of hours": 5},
              {"Date": "03/11/22","Time":"05:34:02", "Number of hours": 5},
              {"Date": "03/11/22","Time":"05:34:02", "Number of hours": 5},
              {"Date": "03/11/22","Time":"05:34:02", "Number of hours": 5},
              {"Date": "03/11/22","Time":"05:34:02", "Number of hours": 5},
              {"Date": "03/11/22","Time":"05:34:02", "Number of hours": 5},
              {"Date": "03/11/22","Time":"05:34:02", "Number of hours": 5},
              {"Date": "03/11/22","Time":"05:34:02", "Number of hours": 5},
              {"Date": "03/11/22","Time":"05:34:02", "Number of hours": 5},
              {"Date": "03/11/22","Time":"05:34:02", "Number of hours": 5},
              {"Date": "03/11/22","Time":"05:34:02", "Number of hours": 5},
              {"Date": "03/11/22","Time":"05:34:02", "Number of hours": 5},
              {"Date": "03/11/22","Time":"05:34:02", "Number of hours": 5},
              {"Date": "04/11/22","Time":"06:35:03", "Number of hours": 6}, 
            ]} // list of objects
            colNames={["Date","Time","Number of hours"]} //List of Strings
            colSettings={[
              { name: "Date", type: COL_TYPES.STRING, width: "40%" },
              { name: "Time", type: COL_TYPES.STRING, width: "30%" },
              { name: "Number of hours", type: COL_TYPES.INT, width: "30%" },
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
    elevation: 15,
    marginTop: 36
  },
  divText: {
    fontSize: 16,
  },
});