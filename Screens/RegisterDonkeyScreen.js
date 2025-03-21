import { StatusBar, StyleSheet, SafeAreaView, View, TextInput, Image, Button, Text, ScrollView, Alert, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { getFirestore, collection, getDoc, doc, updateDoc, addDoc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, imageURL } from 'firebase/storage';
import { app } from '../firebaseConfig'; // Update the path if necessary
import RNPickerSelect from 'react-native-picker-select';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import uuid from 'react-native-uuid';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig'; 
import * as FileSystem from 'expo-file-system';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';


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
  const [ healthcareWorker, setHealthCareWorker] = useState('');
  const [image, setImage] = useState('');
  const [healthStatus, setHealthStatus] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [othersymptoms, setOtherSymptoms] = useState('');
  const [medication, setMedication] = useState('');
  const [medicationDate, setMedicationDate] = useState(null);
  const [medicalRecord, setMedicalRecord] = useState('');
  const [showMedicationDatePicker, setShowMedicationDatePicker] = useState(false);
  const [lastCheckup, setLastCheckup] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);


  // function to save data locally
  const saveDonkeyLocally = async (donkey) => {
    try {
      const existingDonkeys = await AsyncStorage.getItem('localDonkeys');
      const donkeys = existingDonkeys ? JSON.parse(existingDonkeys) : [];
      donkeys.push({ ...donkey, synced: false });
      await AsyncStorage.setItem('localDonkeys', JSON.stringify(donkeys));
    } catch (error) {
      console.error('Error saving donkey locally:', error);
    }
  };
  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setLastCheckup(selectedDate);
    }
  };

  const onMedicationDateChange = (event, selectedDate) => {
    setShowMedicationDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setMedicationDate(selectedDate);
    }
  };

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

  const handleMapPress = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
    setLocation(`${latitude}, ${longitude}`);
  };
  const [region, setRegion] = useState({
    latitude: -23.14064265296368,
    longitude: 28.99409628254349,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,});
    
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
  
      return imageUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert('Upload Error', error.message);
      throw error;
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
      setIsLoading(true);
      try {
        let imageUrl = '';
        if (image) {
          imageUrl = await uploadImage(image);
        }
  
        const donkey = {
          id,
          name,
          gender,
          age,
          location,
          owner,
          healthcareWorker,
          imageUrl,
          healthStatus,
          symptoms,
          othersymptoms,
          medication,
          medicationDate: medicationDate ? medicationDate.toISOString() : null,
          medicalRecord,
          lastCheckup: lastCheckup ? lastCheckup.toISOString() : null,
        };
  
        const isConnected = await NetInfo.fetch().then(state => state.isConnected);
  
        if (isConnected) {
          // Add donkey details to Firebase
          const docRef = await addDoc(collection(db, 'donkeys'), donkey);
          await updateDoc(docRef, { location: location });
          if (imageUrl) {
            await updateDoc(docRef, { imageUrl: imageUrl });
          }
          console.log('Donkey added successfully with ID: ', docRef.id);
        } else {
          // Save donkey locally
          await saveDonkeyLocally(donkey);
          Alert.alert('Offline Mode', 'Donkey details saved locally. They will be synced when you back online.');
        }
  
        setIsLoading(false);
        navigation.navigate('Confirmation Screen', { donkey });
      } catch (error) {
        setIsLoading(false);
        Alert.alert('Error', 'Failed to add donkey. Please try again.');
        console.error('Error adding donkey: ', error);
      }
    }
  };

  //synchronized mechanism
  const syncLocalDonkeys = async () => {
    const isConnected = await NetInfo.fetch().then(state => state.isConnected);
    if (!isConnected) return;
  
    try {
      const localDonkeys = await AsyncStorage.getItem('localDonkeys');
      if (localDonkeys) {
        const donkeys = JSON.parse(localDonkeys);
        for (const donkey of donkeys) {
          if (!donkey.synced) {
            const docRef = await addDoc(collection(db, 'donkeys'), donkey);
            await updateDoc(docRef, { location: donkey.location });
            if (donkey.imageUrl) {
              await updateDoc(docRef, { imageUrl: donkey.imageUrl });
            }
            donkey.synced = true;
          }
        }
        await AsyncStorage.setItem('localDonkeys', JSON.stringify(donkeys));
      }
    } catch (error) {
      console.error('Error syncing local donkeys:', error);
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
    setHealthCareWorker('');
    setImage('');
    generateUniqueId(); 
  };

  const formatDate = (date) => {
    if (!date) return 'No date selected';
    return format(date, 'MMMM d, yyyy');
  };

  return (
    
    <SafeAreaView style={styles.containers}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.menuStrip}>
          <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.buttonTextCust}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Register Donkey')}>
            <Text style={styles.buttonTextCust}>Register Donkey</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Search for Donkey')}>
            <Text style={styles.buttonTextCust}>Search for Donkey</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton} onPress={handleSignOut}>
            <Text style={styles.buttonTextCust}>Sign Out</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Unique ID:</Text>
          <TextInput
            style={styles.input}
            placeholder="Unique ID"
            value={id}
            editable={false}
          />
          <Text style={styles.label}>Name:</Text>
          <TextInput
            style={styles.input}
            placeholder="Donkey's Name"
            value={name}
            onChangeText={setName}
          />
          <Text style={styles.label}>Gender:</Text>
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
            placeholder={{ label: "Select Gender", value: '' }}
          />
         
          <Text style={styles.label}>Age:</Text>
          <RNPickerSelect
            onValueChange={(value) => {
              setAge(value);
            }}
            items={[
              { label: '< 12 months', value: '< 12 months' },
              { label: '1-5 years', value: '1-5yrs' },
              { label: '6-10 years', value: '6-10yrs' },
              { label: 'Older than 10 years', value: 'older than 10yrs' },
              { label: 'Unknown', value: 'unknown' },             
            ]}
            style={pickerSelectStyles}
            value={age}
            placeholder={{ label: "Select Age", value: '' }}
          />
          <Text style={styles.label}>Owner's Name:</Text>
          <TextInput
            style={styles.input}
            placeholder="Owner's Name"
            value={owner}
            onChangeText={setOwner}
          />

          <Text style={styles.label}>Health care worker Name:</Text>
          <TextInput
            style={styles.input}
            placeholder="Health care worker's Name"
            value={healthcareWorker}
            onChangeText={setHealthCareWorker}
          />
          
          <Text style={styles.label}>Location:</Text>
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
            {selectedLocation && <Marker coordinate={selectedLocation} />}
          </MapView>
        </View>

        <Text style={styles.label}>Selected Location:</Text>
          <Text>
            {selectedLocation 
              ? `${selectedLocation.latitude}, ${selectedLocation.longitude}` 
              : 'No location selected'}
          </Text>
        <TouchableOpacity style={styles.button} onPress={() => Alert.alert('Location Confirmed')}>
        <Text style={styles.buttonText}>Select Location</Text>

      </TouchableOpacity>
      
      </ScrollView>
      <Text style={styles.label}>Donkey Picture</Text>
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>Pick Image</Text>
        </TouchableOpacity>
        {image ? (
          <Image source={{ uri: image }} style={{ width: 200, height: 200, alignSelf: 'center', borderWidth: 2, borderColor: '#a67c52', marginTop: 20 }}/>
        ) : (
          <Text>No image selected</Text>
        )}
         <TouchableOpacity style={styles.deleteButton} onPress={() => setImage(null)}>
      <Text style={styles.deleteButtonText}>Remove</Text>
        </TouchableOpacity>
      <Text style={styles.label}>Health Status:</Text>
            <RNPickerSelect
                onValueChange={(value) => setHealthStatus(value)}
                items={[
                    { label: 'Good', value: 'Good' },
                    { label: 'Mild', value: 'Mild' },
                    { label: 'Serious', value: 'Serious' },
                ]}
                style={pickerSelectStyles}
                value={healthStatus}
                placeholder={{ label: "Select Health Status", value: '' }}
            />
            <Text style={styles.label}>Symptoms:</Text>
            <RNPickerSelect
                onValueChange={(value) => setSymptoms(value)}
                items={[
                    { label: 'None', value: 'None'},
                    { label: 'Chafe marks (from tack)', value: 'Chafe marks (from tack)' },
                    { label: 'Lying down/ not able to stand', value: 'Lying down/ not able to stand' },
                    { label: 'Wound', value: 'Wound' },
                    { label: 'Loss of Appetite', value: 'loss_of_appetite' },
                    { label: 'Skin infection', value: 'Skin infection'},
                    { label: 'Lame', value: 'Lame'},
                    { label: 'Misformed hoof', value: 'Misformed hoof'},
                    { label: 'Infected eye', value: 'Infected eye'},
                    { label: 'Diarrhoea', value: 'Diarrhoea'},
                    { label: 'Runny nose', value: 'Runny nose'},
                    { label: 'Coughing', value: 'Coughing'},
                ]}
                style={pickerSelectStyles}
                value={symptoms}
                placeholder={{ label: "Select a Symptom", value: '' }}
            />
             <Text style={styles.label}>Other Symptoms:</Text>
            <RNPickerSelect
                onValueChange={(value) => setOtherSymptoms(value)}
                items={[
                    { label: 'None', value: 'None'},
                    { label: 'Chafe marks (from tack)', value: 'Chafe marks (from tack)' },
                    { label: 'Lying down/ not able to stand', value: 'Lying down/ not able to stand' },
                    { label: 'Wound', value: 'Wound' },
                    { label: 'Loss of Appetite', value: 'loss_of_appetite' },
                    { label: 'Skin infection', value: 'Skin infection'},
                    { label: 'Lame', value: 'Lame'},
                    { label: 'Misformed hoof', value: 'Misformed hoof'},
                    { label: 'Infected eye', value: 'Infected eye'},
                    { label: 'Diarrhoea', value: 'Diarrhoea'},
                    { label: 'Runny nose', value: 'Runny nose'},
                    { label: 'Coughing', value: 'Coughing'},
                ]}
                style={pickerSelectStyles}
                value={othersymptoms}
                placeholder={{ label: "Select Another Symptom (Optional)", value: '' }}
            />
            <Text style={styles.label}>Medication:</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter Medication Name"
                value={medication}
                onChangeText={setMedication}
            />

            <Text style={styles.label}>Date Medication Administered:</Text>
            <TouchableOpacity style={styles.button} onPress={() => setShowMedicationDatePicker(true)}>
              <Text style={styles.buttonText}>Select Date</Text>
            </TouchableOpacity>
            <Text style={styles.dateDisplay}>{formatDate(medicationDate)}</Text>
            {showMedicationDatePicker && (
                <DateTimePicker
              
                    value={medicationDate || new Date()}
                    mode="date"
                    display="default"
                    onChange={onMedicationDateChange}
                />
            )}

            <Text style={styles.label}>Last Check-Up Date:</Text>
            <TouchableOpacity style={styles.button} onPress={() => setShowDatePicker(true)}>
                <Text style={styles.buttonText}>Select Date</Text>
            </TouchableOpacity>
            <Text style={styles.dateDisplay}>{formatDate(lastCheckup)}</Text>
            {showDatePicker && (
                <DateTimePicker
                    value={lastCheckup || new Date()}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                />
            )}

            <Text style={styles.label}>Medical Record:</Text>
            <TextInput
                style={styles.textArea}
                placeholder="Describe the previous treatments / operations"
                value={medicalRecord}
                onChangeText={setMedicalRecord}
                multiline
                numberOfLines={4}
            />
             {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#AD957E" />
            <Text style={styles.loadingText}>Adding Donkey...</Text>
          </View>
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleAddDonkey}>
            <Text style={styles.buttonText}>Add Donkey</Text>
          </TouchableOpacity>
        )}
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
    borderRadius: 10,       // Rounded corners for the button
    marginTop: 10,
    width: 90,
  },
  deleteButtonText: {
    color: '#fff',  // White text
    fontSize: 10,   // Font size for the text
    fontWeight: 'bold', // Makes the text bold
    textAlign: 'center',
  },
  addDonkeyText: {
    backgroundColor: '#AD957E',
    padding: 8,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    textAlign: 'center',
    fontSize: 16,
    color: '#fff',
    

  },
  addDonkeyButton: {
    backgroundColor: '#ffffff00',
    padding: 1,
    borderRadius: 10,
    
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
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
    fontSize: 15,
    marginBottom: 5,
    color: '#AD957E',
  },
  button: {
    backgroundColor: '#AD957E',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 15,
    color: '#fff',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    fontSize: 14,
    borderRadius: 5,
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
  dateDisplay: {
    fontSize: 16,
    marginTop: 5,
    marginBottom: 10,
    color: '#333',
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#AD957E',
    fontSize: 16,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 14,
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