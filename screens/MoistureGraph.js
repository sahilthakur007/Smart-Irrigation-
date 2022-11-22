import { View, Text, StyleSheet, Dimensions, Pressable } from "react-native";
import PureChart from 'react-native-pure-chart';

export default function MoistureGraph({navigation}) {
  const sampleData = [
    {x: '2018-01-01', y: 30},
    {x: '2018-01-02', y: 200},
    {x: '2018-01-03', y: 170},
    {x: '2018-01-04', y: 250},
    {x: '2018-01-05', y: 10}
]
const data = [30, 200, 170, 250, 10] 
  return (
    <View style={styles.container}>
      <View style={styles.outerbox1}>
        <View style={styles.div}>
          <Text style={styles.divText}>Live Moisture Level</Text>
        </View>
       <PureChart data={sampleData} type='line' />
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
