import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './src/screens/HomeScreen';
import AccountsScreen from './src/screens/AccountsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { CalendarProvider } from './src/context/CalendarContext';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <CalendarProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen 
              name="Home" 
              component={HomeScreen}
              options={{ title: 'Calendar Syncer' }}
            />
            <Stack.Screen 
              name="Accounts" 
              component={AccountsScreen}
              options={{ title: 'Manage Accounts' }}
            />
            <Stack.Screen 
              name="Settings" 
              component={SettingsScreen}
              options={{ title: 'Settings' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </CalendarProvider>
    </SafeAreaProvider>
  );
}
