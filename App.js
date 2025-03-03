import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./LoginScreen";
import SignUpScreen from "./SignUpScreen";
import ChildListScreen from "./ChildListScreen";
import TestHistoryScreen from "./TestHistoryScreen";
import JournalScreen from "./JournalScreen";
import ChildCalendarScreen from "./ChildCalendarScreen";
import ChildJournalListScreen from "./ChildJournalListScreen";
import JournalWriteScreen from "./JournalWriteScreen";
import JournalDetailScreen from "./JournalDetailScreen"; // 추가

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="ChildList" component={ChildListScreen} />
        <Stack.Screen name="TestHistory" component={TestHistoryScreen} />
        <Stack.Screen name="Journal" component={JournalScreen} />
        <Stack.Screen name="ChildCalendar" component={ChildCalendarScreen} />
        <Stack.Screen name="ChildJournalList" component={ChildJournalListScreen} />
        <Stack.Screen name="JournalWrite" component={JournalWriteScreen} />
        <Stack.Screen name="JournalDetail" component={JournalDetailScreen} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
}
