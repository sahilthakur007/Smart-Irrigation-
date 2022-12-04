import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PumpControl from './PumpControl';
// import MoistureGraph from './MoistureGraph';
import MoistureContent from './MoistureContent';
import MoistureTable from './MoistureTable';
import PumpSpeedTable from './PumpSpeedTable';
import * as firebase from "firebase/app"
import { firebaseConfig } from "../config"
import { useState, useEffect, useRef } from "react";
// import * as Device from "expo-device";
// import * as Notifications from "expo-notifications";
import { getDatabase, ref, onValue, update, set, push } from "firebase/database"
const Tab = createBottomTabNavigator();

const PumpControlStack = createStackNavigator();
const app = firebase.initializeApp(firebaseConfig)
const db = getDatabase(app)
function PumpControlStackScreen({route}) {

  // db = route.params.db
  const isPumpOff = route.params.isPumpOff
  const handlePumpCondition = route.params.handlePumpCondition
  const setisPumpOff = route.params.setisPumpOff
  const pumpStatus = route.params.pumpStatus
  const setPumpStatus = route.params.setPumpStatus

 return (
   <PumpControlStack.Navigator>
     <PumpControlStack.Screen options={{ headerShown: false }} name="pumpControl" component={PumpControl} initialParams={{db , isPumpOff, handlePumpCondition, setisPumpOff, pumpStatus, setPumpStatus }} />             
     <PumpControlStack.Screen options={{ headerShown: false }} name="pumpSpeedData" component={PumpSpeedTable} initialParams={{ db }} />
   </PumpControlStack.Navigator>
  );
}
// const MoistureGraphStack = createStackNavigator();
// function MoistureGraphStackScreen() {
//  return (
//    <MoistureGraphStack.Navigator>
//      <MoistureGraphStack.Screen options={{ headerShown: false }} name="moistureGraph" component={MoistureGraph} initialParams={{ db }} />             
//      <MoistureGraphStack.Screen options={{ headerShown: false }} name="moistureData" component={MoistureTable} initialParams={{ db }} />
//    </MoistureGraphStack.Navigator>
//   );
// }

export default function MainContainer() {
  const [pumpStatus, setPumpStatus] = useState("Pump off Manually");
  const [isPumpOff, setisPumpOff] = useState(false);
  const handlePumpCondition = () => {
    if (isPumpOff) {
      setisPumpOff(false);

      //PUMP ON HERE
      set(ref(db, "/Pump Status"), false);

      set(ref(db, "/isOnManually"), true);
      set(ref(db, "/isOffManually"), false);
      setPumpStatus("Pump on Manually");

      // entries to pum table
      var hours = new Date().getHours(); //To get the Current Hours
      var min = new Date().getMinutes(); //To get the Current Minutes
      var sec = new Date().getSeconds();
      push(ref(db, "/pumpData/date"), Date.now());
      push(ref(db, "/pumpData/time"), `${hours}:${min}:${sec}`);
      push(ref(db, "/pumpData/status"), " Manually ON");
      // set(ref(db, "/pumpData/"), "Manually");

    } else {
      setisPumpOff(true);
      set(ref(db, "/Pump Status"), true);
      set(ref(db, "/isOffManually"), true);
      set(ref(db, "/isOnManually"), false);
      setPumpStatus("Pump off Manually");
      // PUMP OFF HERE

      // entries in pump table

      var hours = new Date().getHours(); //To get the Current Hours
      var min = new Date().getMinutes(); //To get the Current Minutes
      var sec = new Date().getSeconds();
      push(ref(db, "/pumpData/date"), Date.now());
      push(ref(db, "/pumpData/time"), `${hours}:${min}:${sec}`);
      push(ref(db, "/pumpData/status"), "Manually OFF");
      // set(ref(db, "/pumpData/"), "Manually");
    }
    // setSendNotification(true)
    // if (pumpStatus == "Pump off Manually") scheduleNotificationPumpOnManually();
    // else if (pumpStatus == "Pump on Manually") scheduleNotificationPumpOffManually();
  };
    return (
      <NavigationContainer>
        <Tab.Navigator
        screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let iconName;
              if (route.name === 'Moisture Content') {
                iconName = 'home-outline'
              } else if (route.name === 'Pump Control') {
                iconName ='options-outline'
              } else if (route.name === 'Moisture Data') {
                iconName ='bar-chart-outline'
              }
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            headerShown: false,
            tabBarHideOnKeyboard: true,
            tabBarActiveBackgroundColor: 'green',
            tabBarStyle: {position: 'absolute'},
            tabBarIconStyle: {paddingBottom: 0,marginTop: 6},
            tabBarLabelPosition: 'below-icon',
            tabBarLabelStyle: {paddingBottom: 8, fontSize: 10, paddingTop:0},
            tabBarActiveTintColor: 'white',
            tabBarInactiveTintColor: 'white',
            tabBarStyle: {backgroundColor: 'black', height: 62}
          })}
          >
          <Tab.Screen name="Moisture Content" component={MoistureContent} initialParams={{ db, isPumpOff, handlePumpCondition, setisPumpOff, pumpStatus, setPumpStatus}}/>
          <Tab.Screen name="Pump Control" component={PumpControlStackScreen} initialParams={{ db, isPumpOff, handlePumpCondition, setisPumpOff, pumpStatus, setPumpStatus }} />
          <Tab.Screen name="Moisture Data" component={MoistureTable} initialParams={{ db }} />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }