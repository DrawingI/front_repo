import React from 'react';
import { SafeAreaView } from 'react-native';
import LoginScreen from './LoginScreen';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LoginScreen />
    </SafeAreaView>
  );
}
