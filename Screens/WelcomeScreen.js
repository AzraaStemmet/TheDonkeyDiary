
import React from 'react';
import { StyleSheet, View, Text, Image, Button, ImageBackground, TouchableOpacity } from 'react-native';

const logoImage = require('../assets/bahananwa.jpg');
const homeBackground = require('../assets/back.png');

const HomeScreen = ({ navigation }) => {
  return (
    <ImageBackground
      source={homeBackground}
      style={styles.homeBackground}
      resizeMode="cover" // Ensure the image covers the background properly
    >
      <View style={styles.container}>
        
        <Text style={styles.title}>Welcome to The Donkey Diary</Text>
        <Text style={styles.description}>
          Your trusted platform for managing donkey health and information in rural villages.
        </Text>
     
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.customButton} onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.buttonText}>Sign Up </Text>
          </TouchableOpacity>
          
           <TouchableOpacity style={styles.customButton} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.buttonText}>Login </Text>
          </TouchableOpacity>
         
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  homeBackground: {
    flex: 1, // Ensures ImageBackground covers the entire screen
    justifyContent: 'center', // Centers content vertically
    alignItems: 'center', // Centers content horizontally
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Semi-transparent background to make text readable
    borderRadius: 10,
  },
  customButton: {
    backgroundColor: '#AD957E',
    padding: 15,
    borderRadius: 10,
    width: 100,                       // Optional: set a fixed width for the buttons
    alignItems: 'center',             // Center text inside the button
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#AD957E',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    color: '#696969',
  },
  logo: {
    width: 50,
    height: 50,
    marginBottom: 20, // Add margin below the logo
  },
  buttonContainer: {
    flexDirection: 'row',             // Aligns buttons horizontally
    justifyContent: 'space-evenly',   // Even space between buttons, centered in the container
    alignItems: 'center',             // Vertically centers buttons in the container
    padding: 20,                      // Optional: adds padding around the buttons
    width: 300,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default HomeScreen;
