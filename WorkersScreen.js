import React, {useState} from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ImageBackground, Alert, ScrollView } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from './firebaseConfig'; // Ensure this path is correct
import { useNavigation, useRoute } from '@react-navigation/native';

const WorkersScreen = ({ navigation }) => {
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Home'); // Navigate to Home or Login screen after sign out
    } catch (error) {
      Alert.alert('Sign Out Error', 'Unable to sign out. Please try again later.');
    }
  };

  const route = useRoute();
  const background = require('./assets/back.png'); // Ensure the path to your background image is correct
  const [inputPassword, setInputPassword] = useState('');
  const verifyPassword = () => {
<<<<<<< HEAD
=======
    // Example password check - you should replace this with more secure checks or API calls as needed
>>>>>>> dff3e410bbe91474e385b5b9c78a038a18945500
    const correctPassword = 'secret123'; // You should manage passwords more securely
    if (inputPassword === correctPassword) {
      navigation.navigate('Reports');
    } else {
      Alert.alert('Access Denied', 'The password you entered is incorrect.');
    }
  };

  const handleViewReportsPress = () => {
    Alert.prompt(
      'Enter Password',
      'This section is password protected. Please enter your password to continue.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => console.log('Password prompt cancelled'),
        },
        {
          text: 'OK',
          onPress: password => {
            setInputPassword(password);
            verifyPassword();
          },
        },
      ],
      'secure-text' // This makes the input password style
    );
  };

  return (
    <ImageBackground source={background} style={styles.background} resizeMode="cover">
      
        <View style={styles.menuStrip}>
          <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('RegisterDonkey')}>
            <Text style={styles.buttonTextCust}>Register Donkey</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('SearchDonkey')}>
            <Text style={styles.buttonTextCust}>Search by ID</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton} onPress={handleViewReportsPress}>
            <Text style={styles.buttonTextCust}>View Reports</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton} onPress={handleSignOut}>
            <Text style={styles.buttonTextCust}>Sign Out</Text>
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.customButton} onPress={() => navigation.navigate('RegisterDonkey')}>
            <Text style={styles.buttonText}>Register Donkey</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.customButton} onPress={() => navigation.navigate('SearchDonkey')}>
            <Text style={styles.buttonText}>Search by ID</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.customButton} onPress={() => navigation.navigate('ViewReports')}>
            <Text style={styles.buttonText}>View Existing Donkeys</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.customButton}  onPress={handleViewReportsPress}>
            <Text style={styles.buttonText}>View Reports</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default WorkersScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'space-around',
    paddingVertical: 20,
  },
  menuStrip: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: 'rgba(173, 149, 126, 0.75)', // Semi-transparent background for the menu
  },
  menuButton: {
    padding: 5,
    borderRadius: 5,
    backgroundColor: '#AD957E',
  },
  
  buttonTextCust: {
    color: '#FFF',
    fontSize: 12,
    textAlign: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  customButton: {
    backgroundColor: '#AD957E',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
});