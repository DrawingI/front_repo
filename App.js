import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './LoginScreen';
import SignUpScreen from './SignUpScreen';
import ChildListScreen from './ChildListScreen';
import ChildRegisterScreen from './ChildRegisterScreen';
import TestHistoryScreen from './TestHistoryScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="ChildList" component={ChildListScreen} />
        <Stack.Screen name="ChildRegister" component={ChildRegisterScreen} />
        <Stack.Screen name="TestHistory" component={TestHistoryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
