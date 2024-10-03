import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { initializeApp, getApps } from 'firebase/app';
import firebaseConfig from './firebaseConfig';

// Import your screens
import WelcomeScreen from './Screens/WelcomeScreen';
import LoginScreen from './Screens/LoginScreen';
import SignupScreen from './Screens/SignupScreen';
import HomeScreen from './Screens/HomeScreen';
import RegisterDonkeyScreen from './Screens/RegisterDonkeyScreen';
import SearchDonkey from './Screens/SearchDonkey';
import RegistrationConfirmationScreen from './Screens/RegistrationConfirmationScreen';
import ViewExistingDonkeys from './Screens/ViewExistingDonkeys';
import HealthRecordScreen from './Screens/HealthRecordScreen';
import EditDonkeyScreen from './Screens/EditDonkeyScreen'; 
import DonkeyReport from './Screens/Reports';
import EditConfirmationScreen from './Screens/EditConfirmationScreen';

// Loading screen image
const logoImage = require('./assets/bahananwa.jpg');

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
        await new Promise((resolve) => setTimeout(resolve, 1000));
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
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerRight: () => (
            <Image
              source={logoImage}
              style={{ width: 40, height: 40, marginRight: 10 }} // Adjust size as necessary
            />
          ),
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#f5f5f5', 
          },
          headerTintColor: '#333',
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Register Donkey" component={RegisterDonkeyScreen} />
        <Stack.Screen name="Search for Donkey" component={SearchDonkey} />
        <Stack.Screen name="Confirmation Screen" component={RegistrationConfirmationScreen} />       
        <Stack.Screen name="View Existing Donkeys" component={ViewExistingDonkeys} />
        <Stack.Screen name="Health Records" component={HealthRecordScreen} />
        <Stack.Screen name='Edit Donkey Details' component={EditDonkeyScreen} />
        <Stack.Screen name="View Donkey Reports" component={DonkeyReport} />
        <Stack.Screen name='Edit Confirmation' component={EditConfirmationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;