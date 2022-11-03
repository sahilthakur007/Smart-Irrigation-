import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PumpControl from './PumpControl';
import MoistureGraph from './MoistureGraph';
import MoistureContent from './MoistureContent';
import MoistureTable from './MoistureTable';
import PumpSpeedTable from './PumpSpeedTable';
import * as firebase from "firebase/app"
import { getDatabase, ref, onValue, update, set } from "firebase/database"
import { firebaseConfig } from "../config"
const Tab = createBottomTabNavigator();

const PumpControlStack = createStackNavigator();
const app = firebase.initializeApp(firebaseConfig)
const db = getDatabase(app)
function PumpControlStackScreen() {
 return (
   <PumpControlStack.Navigator>
     <PumpControlStack.Screen options={{ headerShown: false }} name="pumpControl" component={PumpControl} initialParams={{ db }} />             
     <PumpControlStack.Screen options={{ headerShown: false }} name="pumpSpeedData" component={PumpSpeedTable} initialParams={{ db }} />
   </PumpControlStack.Navigator>
  );
}
const MoistureGraphStack = createStackNavigator();
function MoistureGraphStackScreen() {
 return (
   <MoistureGraphStack.Navigator>
     <MoistureGraphStack.Screen options={{ headerShown: false }} name="moistureGraph" component={MoistureGraph} initialParams={{ db }} />             
     <MoistureGraphStack.Screen options={{ headerShown: false }} name="moistureData" component={MoistureTable} initialParams={{ db }} />
   </MoistureGraphStack.Navigator>
  );
}

export default function MainContainer() {
  
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
              } else if (route.name === 'Moisture Graph') {
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
          <Tab.Screen name="Moisture Content" component={MoistureContent} initialParams ={{db}}/>
          <Tab.Screen name="Pump Control" component={PumpControlStackScreen} />
          <Tab.Screen name="Moisture Graph" component={MoistureGraphStackScreen} initialParams={{ db }} />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }