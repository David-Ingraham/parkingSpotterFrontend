// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from './screens/HomeScreen';
import { DirectSearchScreen } from './screens/DirectSearchScreen';
import { NearestParkingScreen } from './screens/NearestParkingScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#2e003e',
          },
          headerTintColor: '#fff',
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ title: 'Parking Spotter' }}
        />
        <Stack.Screen 
          name="DirectSearch" 
          component={DirectSearchScreen}
          options={{ title: 'Search Cameras' }}
        />
        <Stack.Screen 
          name="NearestParking" 
          component={NearestParkingScreen}
          options={{ title: 'Nearest Parking' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}