import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';

const logoImage = require('./assets/bahananwa.jpg');

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={logoImage} />
      <Text style={styles.title}>Welcome to The Donkey Diary</Text>
      <Text style={styles.description}>
        Your trusted platform for managing donkey health and information in rural villages.
      </Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E1', // Light beige background consistent with other screens
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 100, // Increased size for better visibility
    height: 100, // Match width
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#AD957E', // Consistent typography color
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    color: '#5C5346', // Darker shade for better readability
  },
  button: {
    backgroundColor: '#AD957E', // Consistent button color with other screens
    padding: 15,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10, // Spacing between buttons
  },
  buttonText: {
    color: '#FFF8E1', // Text color for buttons
    fontSize: 16,
    fontWeight: 'bold',
  },
});
