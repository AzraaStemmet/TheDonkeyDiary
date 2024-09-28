import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { initializeApp, getApps } from 'firebase/app';
import firebaseConfig from './firebaseConfig';

// Import your screens
import HomeScreen from './HomeScreen';
import LoginScreen from './LoginScreen';
import SignupScreen from './SignupScreen';
import WorkersScreen from './WorkersScreen';
import RegisterDonkeyScreen from './RegisterDonkeyScreen';
import SearchDonkey from './SearchDonkey';
import RegistrationConfirmationScreen from './RegistrationConfirmationScreen';
import DonkeyReportScreen from './ViewReports';
import HealthRecordScreen from './HealthRecordScreen';
import EditDonkeyScreen from './EditDonkeyScreen'; 
import DonkeyReport from './Reports';
import EditConfirmationScreen from './EditConfirmationScreen';

// Require the logo image properly
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
        initialRouteName="Home"
        screenOptions={{
          headerRight: () => (
            <Image
              source={logoImage}
              style={{ width: 40, height: 40, marginRight: 10 }} // Adjust size as necessary
            />
          ),
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#f5f5f5', // Optional: adjust the header background
          },
          headerTintColor: '#333', // Optional: adjust the color of the back button and title
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Workers" component={WorkersScreen} />
        <Stack.Screen name="RegisterDonkey" component={RegisterDonkeyScreen} />
        <Stack.Screen name="SearchDonkey" component={SearchDonkey} />
        <Stack.Screen name="RegistrationConfirmationScreen" component={RegistrationConfirmationScreen} />
        <Stack.Screen name="ViewReports" component={DonkeyReportScreen} />
        <Stack.Screen name="HealthRecordScreen" component={HealthRecordScreen} />
        <Stack.Screen name='EditDonkey' component={EditDonkeyScreen} />
        <Stack.Screen name="Reports" component={DonkeyReport} />
        <Stack.Screen name='EditConfirmation' component={EditConfirmationScreen} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;