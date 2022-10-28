import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PumpControl from './PumpControl';
import MoistureGraph from './MoistureGraph';
import MoistureContent from './MoistureContent';
const Tab = createBottomTabNavigator();

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
          <Tab.Screen name="Moisture Content" component={MoistureContent} />
          <Tab.Screen name="Pump Control" component={PumpControl} />
          <Tab.Screen name="Moisture Graph" component={MoistureGraph} />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }