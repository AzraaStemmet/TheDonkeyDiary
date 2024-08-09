import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import React, { useState } from 'react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { app } from './firebaseConfig';

export default function App() {
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');

  const handleAddData = async () => {
    const db = getFirestore(app);
    try {
      await addDoc(collection(db, 'donkeys'), {
        name,
        breed,
      });
      alert('Donkey added successfully!');
      // Clear the input fields
      setName('');
      setBreed('');
    } catch (e) {
      console.error('Error adding document: ', e);
      alert('Failed to add donkey. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add a New Donkey</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Breed"
        value={breed}
        onChangeText={setBreed}
      />
      <Button title="Add Donkey" onPress={handleAddData} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16, // Added padding for better spacing
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    width: '100%', // Ensure input fields take up full width
  },
});
