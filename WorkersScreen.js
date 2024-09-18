import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ImageBackground, Alert, ScrollView } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from './firebaseConfig'; // Ensure this path is correct

const WorkersScreen = ({ navigation }) => {
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Home'); // Navigate to Home or Login screen after sign out
    } catch (error) {
      Alert.alert('Sign Out Error', 'Unable to sign out. Please try again later.');
    }
  };
  const background = require('./assets/back.png'); // Ensure the path to your background image is correct

  return (
    <ImageBackground source={background} style={styles.background} resizeMode="cover">
      
        <View style={styles.menuStrip}>
          <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('RegisterDonkey')}>
            <Text style={styles.buttonTextCust}>Register Donkey</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('SearchDonkey')}>
            <Text style={styles.buttonTextCust}>Search by ID</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('ViewReports')}>
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
          <TouchableOpacity style={styles.customButton} onPress={() => navigation.navigate('Reports')}>
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