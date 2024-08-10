import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import AppLoading from 'expo-app-loading';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { initializeApp } from 'firebase/app';
import firebaseConfig from './firebaseConfig';
import HomeScreen from './HomeScreen';
import LoginScreen from './LoginScreen';
import WorkersScreen from './WorkersScreen';
import RegisterDonkeyScreen from './RegisterDonkeyScreen';

const Stack = createStackNavigator();

const App = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    initializeApp(firebaseConfig);
  }, []);

  if(!isReady) {
    return <AppLoading startAsync={() => Promise.resolve()} onFinish={() => setIsReady(true)} onError={console.warn} />;
    
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen name='Home' component={HomeScreen} />
        <Stack.Screen name='Login' component={LoginScreen} />
        <Stack.Screen name='Workers' component={WorkersScreen} />
        <Stack.Screen name='RegisterDonkey' component={RegisterDonkeyScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5dc',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
