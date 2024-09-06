import React, { useState, useEffect } from 'react';
import { StatusBar, StyleSheet, SafeAreaView, View, TextInput, Image, Button, Text, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app } from './firebaseConfig'; // Update the path if necessary
import RNPickerSelect from 'react-native-picker-select';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const RegisterDonkeyScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [location, setLocation] = useState('');
  const [owner, setOwner] = useState('');
  const [image, setImage] = useState('');

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'You need to grant location permissions to use this feature.');
      return;
    }};
  
  const [region, setRegion] = useState({
    latitude: -23.14064265296368,
    longitude: 28.99409628254349,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const handleMapPress = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setLocation(`${latitude}, ${longitude}`); // Update location state as a string
    setRegion({
      ...region,
      latitude,
      longitude,
    });
  };

  const uploadImage = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storage = getStorage(app);
      const storageRef = ref(storage, `donkeys/${id}/image.jpg`); // Ensure 'id' is unique for each donkey
  
      const snapshot = await uploadBytes(storageRef, blob);
      const imageUrl = await getDownloadURL(snapshot.ref);
      console.log('File available at', imageUrl);

      const donkeyDocRef = doc(db, 'donkeys', id); 
      await updateDoc(donkeyDocRef, { imageURL: imageUrl });
      
      Alert.alert('Upload Success', 'Image uploaded successfully!');
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert('Upload Error', error.message);
    }
  };

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
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
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

  const handleNavigateToHealthRecord = () => {
    if (validateForm()) {
      navigation.navigate('HealthRecordScreen', {
        id,
        name,
        gender,
        age,
        location,
        owner,
        image,
      });
    }
  };

  const validateForm = () => {
    if (!name || !gender || !age || !location || !owner) {
      Alert.alert('Validation Error', 'Please fill in all fields correctly.');
      return false;
    }
    return true;
  };

  const resetForm = () => {
    setId('');
    setName('');
    setGender('');
    setAge('');
    setLocation('');
    setOwner('');
    setImage('');
    generateUniqueId(); 
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
          <Text style={styles.label}>Age</Text>
          <RNPickerSelect
            onValueChange={(value) => {
              setAge(value);
              generateUniqueId();
            }}
            items={[
              { label: '< 12 months', value: 12 },
              { label: '1 year', value: 1 },
              { label: '2 years', value: 2 },
              { label: '3 years', value: 3  },
              { label: '4 years', value: 4 },
              { label: '5 years', value: 5 },
              { label: '6 years', value: 6 },
              { label: '> 7 years', value: 7 },
            ]}
            style={pickerSelectStyles}
            value={age}
          />
          <Text style={styles.label}>Owner's Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Owner's Name"
            value={owner}
            onChangeText={setOwner}
          />
          <Text style={styles.label}>Location (Coordinates)</Text>
          <TextInput
            style={styles.input}
            placeholder="Latitude, Longitude"
            value={location}
            editable={false} // Make the location input non-editable
          />
          <ScrollView style={styles.container}>
            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                initialRegion={region}
                onPress={handleMapPress}
              >
                {location && (
                  <Marker
                    coordinate={{
                      latitude: parseFloat(location.split(", ")[0]),
                      longitude: parseFloat(location.split(", ")[1]),
                    }}
                  />
                )}
              </MapView>
            </View>
            <Text style={styles.label}>Selected Location:</Text>
            <Text>{location || 'No location selected'}</Text>
            <TouchableOpacity style={styles.button} onPress={() => Alert.alert('Location Confirmed')}>
              <Text style={styles.buttonText}>Select Location</Text>
            </TouchableOpacity>
          </ScrollView>

          <Text style={styles.label}>Donkey Picture</Text>
          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Text style={styles.buttonText}>Pick Image</Text>
          </TouchableOpacity>
          
          {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
          <Button title="Next" onPress={handleNavigateToHealthRecord} />
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
  mapContainer: {
    height: 400,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
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
  button: {
    backgroundColor: '#AD957E',
    padding: 15,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
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
