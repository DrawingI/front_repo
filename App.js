import React from 'react';
<<<<<<< Updated upstream
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './LoginScreen';
import SignUpScreen from './SignUpScreen';
<<<<<<< Updated upstream
import ChildManagementScreen from './ChildManagementScreen';
=======
import ChildListScreen from "./ChildListScreen";
import ChildRegisterScreen from "./ChildRegisterScreen";
import TestHistoryScreen from "./TestHistoryScreen";
>>>>>>> Stashed changes

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
<<<<<<< Updated upstream
        <Stack.Screen name="ChildManagement" component={ChildManagementScreen} />
=======
        <Stack.Screen name="ChildList" component={ChildListScreen} />
        <Stack.Screen name="ChildRegister" component={ChildRegisterScreen} />
        <Stack.Screen name="TestHistory" component={TestHistoryScreen} />
>>>>>>> Stashed changes
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
