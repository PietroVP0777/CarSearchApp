import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import CarComparatorScreen from "../screens/CarComparatorScreen";
import SearchNavigator from "./SearchNavigator";
import Ionicons from "@expo/vector-icons/Ionicons";
import ComparatorNavigator from "./ComparatorNavigator";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,

          tabBarActiveTintColor: "#fff",

          tabBarStyle: {
            backgroundColor: "#102b4e",
            borderTopWidth: 0,
          },
        }}
      >
        <Tab.Screen
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="car-outline" size={size} color={color} />
            ),
          }}
          screenOptions={{ headerShown: false }}
          name="Home"
          component={SearchNavigator}
        />
        <Tab.Screen
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="git-compare-outline" size={size} color={color} />
            ),
          }}
          screenOptions={{ headerShown: false }}
          name="Comparator"
          component={ComparatorNavigator}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
