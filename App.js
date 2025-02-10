import React from 'react';
<<<<<<< Updated upstream
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './LoginScreen';
import SignUpScreen from './SignUpScreen';
import ChildManagementScreen from './ChildManagementScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="ChildManagement" component={ChildManagementScreen} />
      </Stack.Navigator>
    </NavigationContainer>
=======
import { SafeAreaView } from 'react-native';
import LoginScreen from './LoginScreen'; // LoginScreen 가져오기

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LoginScreen />
    </SafeAreaView>
>>>>>>> Stashed changes
  );
}
