// screens/RegisterDonkeyScreen.js
import React, { useState, useEffect } from 'react';
import { StatusBar, StyleSheet, SafeAreaView, View, TextInput, Image, Button, Text, ScrollView, Alert } from 'react-native';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import { app } from './firebaseConfig'; // Update the path if necessary
import RNPickerSelect from 'react-native-picker-select';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRoute } from '@react-navigation/native';

const RegisterDonkeyScreen = () => {
  const navigation = useNavigation(); // Hook to get the navigation prop
  const route = useRoute();

  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [location, setLocation] = useState('');
  const [owner, setOwner] = useState('');
  const [image, setImage] = useState(null);
  const [health, setHealth] = useState('');

  useEffect(() => {
    if (route.params?.reset) {
      resetForm();
    }
  }, [route.params]);

  useEffect(() => {
    generateUniqueId();
  }, [gender, age]);

  const generateUniqueId = async () => {
    const db = getFirestore(app);
    const querySnapshot = await getDocs(collection(db, 'donkeys'));
    const donkeyCount = querySnapshot.size + 1;
    const genderCode = gender === 'male' ? '01' : '02';
    const year = new Date().getFullYear().toString().slice(-2);
    const ageCode = getAgeCode(age);
    const newId = `${donkeyCount}-${genderCode}-${year}-${ageCode}`;
    setId(newId);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      setImage(result.uri);
      uploadImage(result.uri);
    }
  };

  const uploadImage = async (uri) => {
    // Logic to upload image
  };

  const getAgeCode = (age) => {
    switch (age) {
      case '< 12 months':
        return '00';
      case '1 year':
        return '01';
      case '2 years':
        return '02';
      case '3 years':
        return '03';
      case '4 years':
        return '04';
      case '5 years':
        return '05';
      case '6 years':
        return '06';
      case '> 7 years':
        return '08';
      default:
        return '00';
    }
  };

  const handleRegister = async () => {
    if (validateForm()) {
      const db = getFirestore(app);
      try {
        let imageUrl = '';
        if (image) {
          imageUrl = await uploadImage(image);
        }
        await addDoc(collection(db, 'donkeys'), {
          id,
          name,
          gender,
          breed,
          age,
          location,
          owner,
          health,
          imageUrl,
        });
        Alert.alert('Success', 'Donkey registered successfully!');
        navigation.navigate('DonkeyDetails', { id, name, gender, breed, age, location, owner, health, imageUrl });
      } catch (e) {
        console.error('Error adding document: ', e);
        Alert.alert('Error', 'Failed to register donkey. Please try again.');
      }
    }
  };

  const validateForm = () => {
    if (!id || !name || gender === 'default' || breed === 'default' || age === 'default' || !location || !owner || health === 'default') {
      Alert.alert('Validation Error', 'Please fill in all fields correctly.');
      return false;
    }
    return true;
  };

  const resetForm = () => {
    setId('');
    setName('');
    setGender('');
    setBreed('');
    setAge('');
    setLocation('');
    setOwner('');
    setImage(null);
    setHealth('');
    generateUniqueId(); // Call this if you want to generate a new ID when resetting
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
            onValueChange={(value) => {
              setGender(value);
              generateUniqueId();
            }}
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
            ]}
            style={pickerSelectStyles}
            value={breed}
          />
          <Text style={styles.label}>Age</Text>
          <RNPickerSelect
            onValueChange={(value) => {
              setAge(value);
              generateUniqueId();
            }}
            items={[
              
              { label: '< 12 months', value: '< 12 months' },
              { label: '1 year', value: '1 year' },
              { label: '2 years', value: '2 years' },
              { label: '3 years', value: '3 years' },
              { label: '4 years', value: '4 years' },
              { label: '5 years', value: '5 years' },
              { label: '6 years', value: '6 years' },
              { label: '> 7 years', value: '> 7 years' },
            ]}
            style={pickerSelectStyles}
            value={age}
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
          <Text style={styles.label}>Donkey Picture</Text>
          <Button title="Pick an image from camera roll" onPress={pickImage} />
          {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
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
    backgroundColor: '#f5f5dc',
  },
  scrollView: {
    backgroundColor: '#f5f5dc',
  },
  formContainer: {
    padding: 20,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
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
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
});

export default RegisterDonkeyScreen;
