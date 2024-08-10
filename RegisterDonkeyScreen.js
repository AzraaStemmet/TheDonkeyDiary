// screens/RegisterDonkeyScreen.js
import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, TextInput, Button, Text, Picker } from 'react-native';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { app } from './firebaseConfig';

const RegisterDonkeyScreen = () => {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState('male');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [location, setLocation] = useState('');
  const [owner, setOwner] = useState('');
  const [health, setHealth] = useState('good');

  const handleRegister = async () => {
    const db = getFirestore(app);
    try {
      await addDoc(collection(db, 'donkeys'), {
        id,
        name,
        gender,
        breed,
        age,
        location,
        owner,
        health,
      });
      alert('Donkey registered successfully!');
      // Clear the input fields
      setId('');
      setName('');
      setGender('male');
      setBreed('');
      setAge('');
      setLocation('');
      setOwner('');
      setHealth('good');
    } catch (e) {
      console.error('Error adding document: ', e);
      alert('Failed to register donkey. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Unique ID"
        value={id}
        onChangeText={setId}
        editable={false} // ID should not be editable once entered
      />
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <Text>Gender</Text>
      <Picker
        selectedValue={gender}
        onValueChange={itemValue => setGender(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Male" value="male" />
        <Picker.Item label="Female" value="female" />
      </Picker>
      <Text>Breed</Text>
      <Picker
        selectedValue={breed}
        onValueChange={itemValue => setBreed(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Breed 1" value="breed1" />
        <Picker.Item label="Breed 2" value="breed2" />
        {/* Add other breeds here */}
      </Picker>
      <TextInput
        style={styles.input}
        placeholder="Age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />
      <TextInput
        style={styles.input}
        placeholder="Owner's Name"
        value={owner}
        onChangeText={setOwner}
      />
      <Text>Health Status</Text>
      <Picker
        selectedValue={health}
        onValueChange={itemValue => setHealth(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Good" value="good" />
        <Picker.Item label="Weak" value="weak" />
        <Picker.Item label="Critical" value="critical" />
      </Picker>
      <Button title="Register Donkey" onPress={handleRegister} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5dc',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
    width: '100%',
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 12,
  },
});

export default RegisterDonkeyScreen;
