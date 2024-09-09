// screens/DonkeyDetails.js
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const DonkeyDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { id, name, gender, age, location, owner, health, imageUrl } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Workers')}>
          <Text style={styles.buttonText}>Workers Menu</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('RegisterDonkey')}>
          <Text style={styles.buttonText}>Register Donkey</Text>
        </TouchableOpacity>
        <Image style={styles.logo} source={require('./assets/bahananwa.jpg')} />
      </View>

      <Text>Donkey ID: {id}</Text>
      <Text>Donkey Name: {name}</Text>
      <Text>Donkey Gender: {gender}</Text>
      <Text>Donkey Age: {age}</Text>
      <Text>Location: {location}</Text>
      <Text>Owner: {owner}</Text>
      <Text>Health Status: {health}</Text>
      {imageUrl ? <Image source={{ uri: imageUrl }} style={{ width: 200, height: 200 }} /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    height: 60,
    // backgroundColor: '#faf4c0', // Consistent header background color
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

export default DonkeyDetails;
