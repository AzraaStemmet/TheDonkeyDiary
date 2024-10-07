import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { initializeApp, getApps } from 'firebase/app';
import firebaseConfig from './firebaseConfig';
import { useNetInfo } from "@react-native-community/netinfo";
import { getFirestore, collection, addDoc, updateDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

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
import ResetPasswordScreen from './Screens/ResetPassword';



// Loading screen image
const logoImage = require('./assets/bahananwa.jpg');

const Stack = createStackNavigator();

const syncLocalDonkeys = async () => {
  const db = getFirestore();
  try {
    const localDonkeys = await AsyncStorage.getItem('localDonkeys');
    if (localDonkeys) {
      const donkeys = JSON.parse(localDonkeys);
      for (const donkey of donkeys) {
        if (!donkey.synced) {
          const docRef = await addDoc(collection(db, 'donkeys'), donkey);
          await updateDoc(docRef, { location: donkey.location });
          if (donkey.imageUrl) {
            await updateDoc(docRef, { imageUrl: donkey.imageUrl });
          }
          donkey.synced = true;
        }
      }
      await AsyncStorage.setItem('localDonkeys', JSON.stringify(donkeys));
    }
  } catch (error) {
    console.error('Error syncing local donkeys:', error);
  }
};

const App = () => {
  const [isReady, setIsReady] = useState(false);
  const netInfo = useNetInfo();

  useEffect(() => {
    if (netInfo.isConnected) {
      syncLocalDonkeys();
    }
  }, [netInfo.isConnected]);

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();

        if (getApps().length === 0) {
          initializeApp(firebaseConfig);
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <NavigationContainer>
      {!netInfo.isConnected && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>You are offline. Data will be synced when you're back online.</Text>
        </View>
      )}
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerRight: () => (
            <Image
              source={logoImage}
              style={{ width: 40, height: 40, marginRight: 10 }}
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
        <Stack.Screen name='Reset Password' component={ResetPasswordScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};


const styles = StyleSheet.create({
  offlineBanner: {
    backgroundColor: 'red',
    padding: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  offlineText: {
    color: 'white',
    textAlign: 'center',
  },
});
export default App;