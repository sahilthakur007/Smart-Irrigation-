import { View, Text, StyleSheet, Dimensions, Pressable } from "react-native";
import { LineChart } from "react-native-chart-kit";

export default function MoistureGraph() {
  return (
    <View style={styles.container}>
      <View style={styles.div}>
        <Text style={styles.divText}>Live Moisture Level</Text>
      </View>

      <View>
  <Text>Bezier Line Chart</Text>
  <LineChart
    data={{
      labels: ["January", "February", "March", "April", "May", "June"],
      datasets: [
        {
          data: [
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100
          ]
        }
      ]
    }}
    width={Dimensions.get("window").width} // from react-native
    height={220}
    yAxisLabel="$"
    yAxisSuffix="k"
    yAxisInterval={1} // optional, defaults to 1
    chartConfig={{
      backgroundColor: "#e26a00",
      backgroundGradientFrom: "#fb8c00",
      backgroundGradientTo: "#ffa726",
      decimalPlaces: 2, // optional, defaults to 2dp
      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      style: {
        borderRadius: 16
      },
      propsForDots: {
        r: "6",
        strokeWidth: "2",
        stroke: "#ffa726"
      }
    }}
    bezier
    style={{
      marginVertical: 8,
      borderRadius: 16
    }}
  />
</View>

      <Pressable style={styles.btn}>
        <Text style={styles.btnText}>View Past Moisture Data</Text>
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
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
});
