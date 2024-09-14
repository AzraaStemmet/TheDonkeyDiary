import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Button } from 'react-native';

const RegistrationConfirmationScreen = ({ route, navigation }) => {
  const { donkey } = route.params;

  const handleConfirmDetails = () => {
    // Proceed to health record screen
    navigation.navigate('HealthRecordScreen', { donkey });
  };

  return (
    <View style={styles.container}>
      <Text> Donkey Registration Successful</Text>
      <Text>Confirm Donkey Details</Text>
      <Text>ID: {donkey.id}</Text>
      <Text>Name: {donkey.name}</Text>
      <Text>Gender: {donkey.gender}</Text>
      <Text>Age: {donkey.age}</Text>
      <Text>Location: {donkey.location}</Text>
      <Text>Owner: {donkey.owner}</Text>

      <Button title="Add Health Record" onPress={handleConfirmDetails} />
      <Button title="Return to Home" onPress={() => navigation.navigate('Workers')} />
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

export default RegistrationConfirmationScreen;
