import React from 'react';
import { SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import LoginScreen from './LoginScreen';
import ChildManagementScreen from './ChildManagementScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen
          name="아이 관리"
          component={ChildManagementScreen}
          options={{
            tabBarIcon: ({ color, size }) => <Ionicons name="happy-outline" size={size} color={color} />,
          }}
        />
        <Tab.Screen
          name="로그인"
          component={LoginScreen}
          options={{
            tabBarIcon: ({ color, size }) => <Ionicons name="log-in-outline" size={size} color={color} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
