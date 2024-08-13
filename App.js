import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { initializeApp, getApps } from 'firebase/app';
import firebaseConfig from './firebaseConfig';
import HomeScreen from './HomeScreen';
import LoginScreen from './LoginScreen';
import WorkersScreen from './WorkersScreen';
import RegisterDonkeyScreen from './RegisterDonkeyScreen';
import SearchDonkey from './SearchDonkey'; // Correct the path according to your project structure
// For default export
import SearchDonkey from './path/to/SearchDonkey';




const Stack = createStackNavigator();

const App = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Prevent the splash screen from auto-hiding
        await SplashScreen.preventAutoHideAsync();

        // Initialize Firebase only if it hasn't been initialized yet
        if (getApps().length === 0) {
          initializeApp(firebaseConfig);
        }

        // Simulate a loading task (e.g., fetching resources)
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(true);
        // Hide the splash screen
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!isReady) {
    return null; // Render nothing while the app is loading
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen name='Home' component={HomeScreen} />
        <Stack.Screen name='Login' component={LoginScreen} />
        <Stack.Screen name='Workers' component={WorkersScreen} />
        <Stack.Screen name='RegisterDonkey' component={RegisterDonkeyScreen} />
        <Stack.Screen name='SearchDonkey' component={SearchDonkey} />

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
