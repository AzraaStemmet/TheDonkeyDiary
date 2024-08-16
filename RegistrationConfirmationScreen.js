import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const RegistrationConfirmationScreen = ({ route, navigation }) => {
  const { donkey } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registration Successful!</Text>
      <Text>ID: {donkey.id}</Text>
      <Text>Name: {donkey.name}</Text>
      <Text>Gender: {donkey.gender}</Text>
      <Text>Breed: {donkey.breed}</Text>
      <Text>Age: {donkey.age}</Text>
      <Text>Location: {donkey.location}</Text>
      <Text>Owner: {donkey.owner}</Text>
      <Text>Health: {donkey.health}</Text>

      <Button title="Register Another Donkey" onPress={() => navigation.navigate('RegisterDonkey')} />
      <Button title="Return to Home" onPress={() => navigation.navigate('Home')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'beige',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default RegistrationConfirmationScreen;
