// EditConfirmationScreen.js
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Button } from 'react-native';

const EditConfirmationScreen = ({ route, navigation }) => {
  const { donkey } = route.params;


  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Workers')}>
          <Text style={styles.buttonText}>Workers Menu</Text>
        </TouchableOpacity>

        <Image style={styles.logo} source={require('./assets/bahananwa.jpg')} />
      </View>

      <Text style={styles.title}>Edit Successful!</Text>
      <Text>ID: {donkey.id}</Text>
      <Text>Name: {donkey.name}</Text>
      <Text>Gender: {donkey.gender}</Text>
      <Text>Breed: {donkey.breed}</Text>
      <Text>Age: {donkey.age}</Text>
      <Text>Location: {donkey.location}</Text>
      <Text>Owner: {donkey.owner}</Text>
      <Text>Health: {donkey.health}</Text>

      <Button title="Edit Another Donkey" onPress={() => navigation.navigate('ViewReports')} />
      <Button title="Return to Home" onPress={() => navigation.navigate('Workers')} />
    </View>
  );
};

export default EditConfirmationScreen;

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
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    height: 60,
  },
  navButton: {
    padding: 10,
    backgroundColor: '#AD957E',
    borderRadius: 5,
    borderColor: '#000000',
  },
  buttonText: {
    color: '#000000',
    fontSize: 16,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
});