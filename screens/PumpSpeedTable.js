import { View, Text, Dimensions, StyleSheet } from "react-native";
import DataTable, { COL_TYPES } from "react-native-datatable-component";

export default function PumpSpeedTable() {
  return (
    <View style={styles.container}>
      <View style={styles.outerbox1}>
        <View style={styles.div}>
          <Text style={styles.divText}>Pump Duration Data</Text>
        </View>
        <View style={{ margin: 15, height: "auto" }}>
          <DataTable
            data={[
              {"Date": "03/11/22", "Number of hours": 5},
              {"Date": "03/11/22", "Number of hours": 5},
              {"Date": "03/11/22", "Number of hours": 5},
              {"Date": "03/11/22", "Number of hours": 5},
              {"Date": "03/11/22", "Number of hours": 5},
              {"Date": "03/11/22", "Number of hours": 5},
              {"Date": "03/11/22", "Number of hours": 5},
              {"Date": "03/11/22", "Number of hours": 5},
              {"Date": "03/11/22", "Number of hours": 5},
              {"Date": "03/11/22", "Number of hours": 5},
              {"Date": "03/11/22", "Number of hours": 5},
              {"Date": "03/11/22", "Number of hours": 5},
              {"Date": "03/11/22", "Number of hours": 5},
              {"Date": "03/11/22", "Number of hours": 5},
              {"Date": "04/11/22", "Number of hours": 6}, 
            ]} // list of objects
            colNames={["Date","Number of hours"]} //List of Strings
            colSettings={[
              { name: "Date", type: COL_TYPES.STRING, width: "50%" },
              { name: "Number of hours", type: COL_TYPES.INT, width: "50%" },
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



//another trial table - (working)
// import React, { Component, useState } from "react";
// import { StyleSheet, View,Dimensions } from "react-native";
// import {
//   Table,
//   TableWrapper,
//   Row,
//   Rows,
//   Col,
// } from "react-native-table-component";

// export default function PumpSpeedTable() {
//   const [state, setState] = useState({
//     tableHead: ["", "Head1", "Head2", "Head3"],
//     tableTitle: ["Title", "Title2", "Title3", "Title4"],
//     tableData: [
//       ["1", "2", "3"],
//       ["a", "b", "c"],
//       ["1", "2", "3"],
//       ["a", "b", "c"],
//     ],
//   });
//   return (
//     <View style={styles.innerContainer}>
//       <Table borderStyle={{ borderWidth: 1 }}>
//         <Row
//           data={state.tableHead}
//           flexArr={[1, 2, 1, 1]}
//           style={styles.head}
//           textStyle={styles.text}
//         />
//         <TableWrapper style={styles.wrapper}>
//           <Col
//             data={state.tableTitle}
//             style={styles.title}
//             heightArr={[28, 28]}
//             textStyle={styles.text}
//           />
//           <Rows
//             data={state.tableData}
//             flexArr={[2, 1, 1]}
//             style={styles.row}
//             textStyle={styles.text}
//           />
//         </TableWrapper>
//       </Table>
//     </View>

//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     alignItems: "center",
//     backgroundColor: "#E5E4DF",
//     height: "100%",
//   },
//   outerbox1: {
//     borderWidth: 1,
//     borderRadius: 8,
//     borderColor: "grey",
//     width: Dimensions.get("window").width * 0.9,
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 0,
//     marginTop: 10,
//     paddingVertical: 12,
//     backgroundColor: "white",
//   },
//   innerContainer: {
//     flex: 1,
//     padding: 16,
//     paddingTop: 30,
//     backgroundColor: "#fff"
//   },
//   head: {
//     height: 40,
//     backgroundColor: "#f1f8ff"
//   },
//   wrapper: {
//     flexDirection: "row"
//   },
//   title: {
//     flex: 1,
//     backgroundColor: "#f6f8fa"
//   },
//   row: {
//     height: 28
//   },
//   text: {
//     textAlign: "center"
//   },
// });
