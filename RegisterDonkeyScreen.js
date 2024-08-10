import React, { useState } from 'react';
import { StatusBar, StyleSheet, SafeAreaView, View, TextInput, Button, Text, ScrollView } from 'react-native';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { app } from './firebaseConfig';
import RNPickerSelect from 'react-native-picker-select';

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
    // ... (handleRegister function remains the same)
  };

  return (
    <SafeAreaView style={styles.container}>
    <ScrollView style={styles.scrollView}>
      <View style={styles.formContainer}>
        <Text style={styles.label}>Unique ID</Text>
        <TextInput
          style={styles.input}
          placeholder="Unique ID"
          value={id}
          onChangeText={setId}
          editable={false}
        />

        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Gender</Text>
        <RNPickerSelect
          onValueChange={(value) => setGender(value)}
          items={[
            { label: 'Male', value: 'male' },
            { label: 'Female', value: 'female' },
          ]}
          style={pickerSelectStyles}
          value={gender}
        />

        <Text style={styles.label}>Breed</Text>
        <RNPickerSelect
          onValueChange={(value) => setBreed(value)}
          items={[
            { label: 'Breed 1', value: 'breed1' },
            { label: 'Breed 2', value: 'breed2' },
            // Add other breeds here
          ]}
          style={pickerSelectStyles}
          value={breed}
        />
        <Text style={styles.label}>Age</Text>
        <TextInput
          style={styles.input}
          placeholder="Age"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
        />
        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          placeholder="Location"
          value={location}
          onChangeText={setLocation}
        />
        <Text style={styles.label}>Owner's Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Owner's Name"
          value={owner}
          onChangeText={setOwner}
        />


        <Text style={styles.label}>Health Status</Text>
        <RNPickerSelect
          onValueChange={(value) => setHealth(value)}
          items={[
            { label: 'Good', value: 'good' },
            { label: 'Weak', value: 'weak' },
            { label: 'Critical', value: 'critical' },
          ]}
          style={pickerSelectStyles}
          value={health}
        />

        <Button title="Register Donkey" onPress={handleRegister} />
      </View>
    </ScrollView>
     </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  scrollView: {
    backgroundColor: 'pink',
    marginHorizontal: 20,
  },
  formContainer: {
    padding: 16,
  },
  label: {
    marginBottom: 8,
    fontWeight: 'bold',
    fontSize: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
    borderRadius: 4,
    backgroundColor: 'white',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
    backgroundColor: 'white',
    marginBottom: 12,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
    backgroundColor: 'white',
    marginBottom: 12,
  },
});

export default RegisterDonkeyScreen;