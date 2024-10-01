import React, { useState, useEffect } from 'react';
import { StatusBar, StyleSheet, SafeAreaView, View, TextInput, Image, Button, Text, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { getFirestore, collection, getDocs, doc, updateDoc, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, imageURL } from 'firebase/storage';
import { app } from './firebaseConfig'; // Update the path if necessary
import RNPickerSelect from 'react-native-picker-select';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import uuid from 'react-native-uuid';
import { signOut } from 'firebase/auth';
import { auth } from './firebaseConfig'; 
import * as FileSystem from 'expo-file-system';


const RegisterDonkeyScreen = () => {
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Welcome'); // Navigate to Home or Login screen after sign out
    } catch (error) {
      Alert.alert('Sign Out Error', 'Unable to sign out. Please try again later.');
    }
  };
  const navigation = useNavigation();
  const route = useRoute();
  const db = getFirestore(app);

  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [location, setLocation] = useState('');
  const [owner, setOwner] = useState('');
  const [image, setImage] = useState('');


  useEffect(() => {
    checkPermissions();
    generateUniqueId();
  }, []);

  const checkPermissions = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'You need to grant location permissions to use this feature.');
      return;
    }
  };

  const generateUniqueId = () => {
    const newId = uuid.v4(); // Generate a unique UUID
    setId(newId);
  };

  const handleMapPress = async (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    const locationString = `${latitude}, ${longitude}`; // Fix format
    setLocation(locationString); // Save location as string
  
    try {
      const donkeyDocRef = doc(db, 'donkeys', id); 
      
      // Check if document exists
      const docSnapshot = await getDoc(donkeyDocRef);
      if (docSnapshot.exists()) {
        // Update the existing document with the location
        await updateDoc(donkeyDocRef, {
          location: locationString,
        });
        console.log('Location updated successfully!');
      } else {
        // If the document doesn't exist, create a new one
        await setDoc(donkeyDocRef, { location: locationString });
        console.log('Document created and location saved!');
      }
    } catch (error) {
      console.error('Error updating location:', error);
    }
  };
  
  
  const [region, setRegion] = useState({
    latitude: -23.14064265296368,
    longitude: 28.99409628254349,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  

  const uploadImage = async (uri) => {
    try {
      const storage = getStorage(app);
      const storageRef = ref(storage, `donkeys/${id}/image.jpg`);
  
      // Fetch the image from the file system as a Blob
      const response = await fetch(uri);
      const blob = await response.blob();  // Convert response to a Blob
  
      // Upload the Blob to Firebase Storage
      const snapshot = await uploadBytes(storageRef, blob);
      const imageUrl = await getDownloadURL(snapshot.ref);
  
      console.log('File available at', imageUrl);
  
      // Save the imageUrl to Firestore
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
  
    console.log("ImagePicker result:", result); // Log the result for debugging
  
    if (!result.canceled) {
      // Access the first image asset in the array
      const imageUri = result.assets[0].uri;
      console.log('Image URI:', imageUri);  // Log the URI for debugging
      setImage(imageUri);  // Update the image state with the URI
      await saveImageLocally(imageUri);  // Save image locally
      await uploadImage(imageUri);  // Upload image to Firebase
    } else {
      console.log("Image picking cancelled");
    }
  };
  
  

  const saveImageLocally = async (uri) => {
    try {
      const fileName = `donkey_${id}.jpg`;  // Ensure 'id' is properly set
      const localUri = `${FileSystem.documentDirectory}${fileName}`;
      console.log("Saving image locally to:", localUri);
      
      await FileSystem.copyAsync({
        from: uri,   // 'from' should be the image URI
        to: localUri // 'to' is the local storage path
      });
  
      console.log('Image saved locally at:', localUri);
      Alert.alert('Success', 'Image saved locally.');
    } catch (error) {
      console.error("Error saving image locally:", error);
      Alert.alert('Error', 'Failed to save image locally.');
    }
  };
  


  const handleAddDonkey = async () => {
    if (validateForm()) {
      try {
        const donkey = {
          id,
          name,
          gender,
          age,
          location,
          owner,
          image,
        };
  
        // Add donkey details to Firebase (assuming you have a 'donkeys' collection)
        const docRef = await addDoc(collection(db, 'donkeys'), donkey);
        
        // Navigate to the confirmation screen
        navigation.navigate('Confirmation Screen', { donkey });
      } catch (error) {
        Alert.alert('Error', 'Failed to add donkey. Please try again.');
        console.error('Error adding donkey: ', error);
      }
    }
  };

  const validateForm = () => {
    if (!name || !gender || !age || !location || !owner) {
      Alert.alert('Error', 'Please fill in all fields correctly.');
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
    generateUniqueId(); // Generate a new ID when resetting
  };

  return (
    
    <SafeAreaView style={styles.containers}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.menuStrip}>
          <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Register Donkey')}>
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
            placeholder="Donkey's Name"
            value={name}
            onChangeText={setName}
          />
          <Text style={styles.label}>Gender</Text>
          <RNPickerSelect
            onValueChange={(value) => {
              setGender(value);
            }}
            items={[
              { label: 'Male', value: 'Male' },
              { label: 'Female', value: 'Female' },
            ]}
            style={pickerSelectStyles}
            value={gender}
          />
         
          <Text style={styles.label}>Age</Text>
          <RNPickerSelect
            onValueChange={(value) => {
              setAge(value);
            }}
            items={[
              { label: '< 12 months', value: '< 12 months' },
              { label: '1-5 years', value: '1-5yrs' },
              { label: '6-10 years', value: '6-10yrs' },
              { label: 'older than 10 years', value: 'older than 10yrs' },
              { label: 'unknown', value: 'unknown' },
             
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
          
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            placeholder="Select a location below"
            value={location}
            onChangeText={setLocation}
            editable={false} 
          />
          <ScrollView style={styles.container}>

        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={region}
            onPress={handleMapPress}
          >
            {location && <Marker coordinate={{ latitude: parseFloat(location.split(', ')[0]), longitude: parseFloat(location.split(', ')[1]) }} />}
          </MapView>
        </View>

        <Text style={styles.label}>Selected Location:</Text>
        <Text>{location ? `${location.latitude}, ${location.longitude}` : 'No location selected'}</Text>
        <TouchableOpacity style={styles.button} onPress={() => Alert.alert('Location Confirmed')}>
        <Text style={styles.buttonText}>Select Location</Text>

      </TouchableOpacity>
      </ScrollView>
      <Text style={styles.label}>Donkey Picture</Text>
<TouchableOpacity style={styles.button} onPress={pickImage}>
  <Text style={styles.buttonText}>Pick Image</Text>
</TouchableOpacity>
{image ? (<Image source={{ uri: image }} style={{ width: 200, height: 200, alignSelf: 'center', borderWidth: 2, borderColor: '#a67c52', marginTop: 20 }}/>

) : (
  <Text>No image selected</Text>
)}
    <TouchableOpacity style={styles.deleteButton} onPress={() => setImage(null)}>
      <Text style={styles.deleteButtonText}>Remove</Text>
    </TouchableOpacity>
          <Button title="Add Donkey" onPress={handleAddDonkey} />
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
  containers: {
    width: '100%', // Adjust as needed
    maxWidth: 400, // Maximum width for large screens
    padding: 20, // Add padding if needed
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Slightly transparent for readability
    borderRadius: 10, // Rounded corners
  },
  deleteButton: {
    backgroundColor: '#d9534f', // Red color for the delete button
    paddingHorizontal: 20,  // Adds width to the button
    paddingVertical: 10,    // Adds height to the button
    borderRadius: 20,       // Rounded corners for the button
    marginTop: 10,
    width: 80,
  },
  deleteButtonText: {
    color: '#fff',  // White text
    fontSize: 9,   // Font size for the text
    fontWeight: 'bold', // Makes the text bold
    textAlign: 'center',
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
    width: '100%',
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
  customButton: {
    backgroundColor: '#AD957E',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonTextCust: {
    color: '#FFF',
    fontSize: 12,
    textAlign: 'center',
  },
  menuStrip: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: 'rgba(173, 149, 126, 0.75)', // Semi-transparent background for the menu
  },
  menuButton: {
    padding: 5,
    borderRadius: 5,
    backgroundColor: '#AD957E',
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
  donkeyImage: {
    width: 200,
    height: 200,
    alignSelf: 'center', // Center the image horizontally
    borderWidth: 2,      // Add border
    borderColor: '#a67c52', // Customize the border color
    borderRadius: 10,    // Optional: To make rounded corners
    marginTop: 20,       // Add some margin at the top for spacing
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