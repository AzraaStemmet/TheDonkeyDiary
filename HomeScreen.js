// screens/HomeScreen.js
import React from 'react';
import { StyleSheet, View, Text, Image, Button, ImageBackground } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
  //  <ImageBackground source={require('./assets/background.jpg')}
    //style={styles.background}
   // >
    <View style={styles.container}>
     <Image
        style={styles.logo}
        source={require('./assets/donkey.jpeg')} // Make sure you have an appropriate image in your assets
      />
      <Text style={styles.title}>Welcome to The Donkey Diary</Text>
      <Text style={styles.description}>
        Your trusted platform for managing donkey health and information in rural villages.
      </Text>
      <Button 
        title="Login" 
        onPress={() => navigation.navigate('Login')} 
        color="#AD957E" // Consider using a button color that matches your theme
      />
    </View>
   // </ImageBackground>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faf4c0', // A light and friendly background color
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#AD957E', // A soothing dark lavender
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    color: '#696969', // Dark gray for the text for better readability
  },
});
