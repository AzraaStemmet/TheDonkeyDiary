import React from 'react';
import { StyleSheet, View, Text, Image, Button, ImageBackground } from 'react-native';

const logoImage = require('./assets/bahananwa.jpg');
const homeBackground = require('./assets/background.jpg');

const HomeScreen = ({ navigation }) => {
  return (
    <ImageBackground
      source={homeBackground}
      style={styles.homeBackground}
      resizeMode="cover" // Ensure the image covers the background properly
    >
      <View style={styles.container}>
        <Image style={styles.logo} source={logoImage} />
        <Text style={styles.title}>Welcome to The Donkey Diary</Text>
        <Text style={styles.description}>
          Your trusted platform for managing donkey health and information in rural villages.
        </Text>
        <View style={styles.buttonContainer}>
          <Button
            title="Sign Up"
            onPress={() => navigation.navigate('Signup')}
            color="black"
          />
          <Button
            title="Login"
            onPress={() => navigation.navigate('Login')}
            color="black"
          />
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
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Semi-transparent background to make text readable
    borderRadius: 10,
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
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around', // Distribute buttons evenly
  },
});

export default HomeScreen;
