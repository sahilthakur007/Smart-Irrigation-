import * as React from "react";
import { StyleSheet, Text, View } from 'react-native';
import MainContainer from "./screens/MainContainer";
import Constants from "expo-constants";
import { Provider } from 'react-redux';
import store from "./Redux/store"
export default function App() {
  return (
    <Provider store={store}>
    <View style={styles.container}>
      <View style={styles.header}>
          <Text style={styles.headerText}>Smart Irrigation</Text>
      </View>
      <MainContainer />
      </View>
    </Provider>
  );
}

const styles= StyleSheet.create({
  container:{
    flex: 1,
  },
  header: {
    backgroundColor: 'black',
    width: '100%',
    height: '7%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Constants.statusBarHeight,
  },
  headerText:{
    fontSize: 24,
    color: 'green',
  }
})