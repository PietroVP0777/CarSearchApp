import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CarComparatorScreen from '../screens/CarComparatorScreen';
import CarComparatorResultScreen from '../screens/CarComparatorResultScreen';

const Stack = createNativeStackNavigator();

export default function ComparatorNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ComparatorHomeScreen" component={CarComparatorScreen} />
      <Stack.Screen name="ComparatorResult" component={CarComparatorResultScreen} />
    </Stack.Navigator>
  );
}