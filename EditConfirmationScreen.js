import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Button, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import { auth } from './firebaseConfig'; 

const EditConfirmationScreen = ({ route, navigation }) => {
  const { donkey } = route.params;
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Home'); // Navigate to Home or Login screen after sign out
    } catch (error) {
      Alert.alert('Sign Out Error', 'Unable to sign out. Please try again later.');
    }
  };

  useEffect(() => {
    if (route.params?.reset) {
      resetForm();
    }
  }, [route.params]);

  const resetForm = () => {
    setId('');
    setName('');
    setGender('');
    setAge('');
    setLocation('');
    setOwner('');
    setImage('');
    generateUniqueId(); // Generate a new ID when resetting
  };  

  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
      <View style={styles.menuStrip}>
        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Register Donkey', { reset: true })}>
         <Text style={styles.buttonTextCust}>Register Donkey</Text>
        </TouchableOpacity>

          <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Search for Donkey')}>
            <Text style={styles.buttonTextCust}>Search by ID</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('View Donkey Reports')}>
            <Text style={styles.buttonTextCust}>View Reports</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton} onPress={handleSignOut}>
            <Text style={styles.buttonTextCust}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        <Image style={styles.logo} source={require('./assets/bahananwa.jpg')} />
      </View>

      <Text style={styles.title}>Edit Successful!</Text>
      <Text>ID: {donkey.id}</Text>
      <Text>Name: {donkey.name}</Text>
      <Text>Gender: {donkey.gender}</Text>
      <Text>Age: {donkey.age}</Text>
      <Text>Location: {donkey.location}</Text>
      <Text>Owner: {donkey.owner}</Text>  
      <Text>Health: {donkey.health}</Text>
      <Button title="Edit Another Donkey" onPress={() => navigation.navigate('View Reports')} />
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
