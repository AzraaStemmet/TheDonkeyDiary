import React from 'react';
import { StyleSheet, View, Text, Image, Button } from 'react-native';

const logoImage = require('./assets/bahananwa.jpg');

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={logoImage} />
      <Text style={styles.title}>Welcome to The Donkey Diary</Text>
      <Text style={styles.description}>
        Your trusted platform for managing donkey health and information in rural villages.
      </Text>
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
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faf4c0',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
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
    marginRight: 10,
  },
});
