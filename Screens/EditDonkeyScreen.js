import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, Button, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { signOut } from 'firebase/auth';
//import { auth, db } from './firebaseConfig'; 
import RNPickerSelect from 'react-native-picker-select';
import MapView, { Marker } from 'react-native-maps';

const EditDonkeyScreen = ({ route, navigation }) => {
  const { donkeyId } = route.params;
  const [donkey, setDonkey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(null);
  
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Welcome'); // Navigate to Home or Login screen after sign out
    } catch (error) {
      Alert.alert('Sign Out Error', 'Unable to sign out. Please try again later.');
    }
  };
  
  //const [location, setLocation] = useState({
   // latitude: donkey?.location?.latitude || -23.14064265296368,
   // longitude: donkey?.location?.longitude || 28.99409628254349,
  //});
  
 

  useEffect(() => {
    if (route.params?.reset) {
      resetForm();
    }
  }, [route.params]);

  const resetForm = () => { // Emptying the fields function
    setId('');
    setName('');
    setGender('');
    setAge('');
    setLocation({ latitude: defaultLatitude, longitude: defaultLongitude });
    setOwner('');
    setImage('');
    generateUniqueId(); // Generate a new ID when resetting
  };




  useEffect(() => {
    const fetchDonkey = async () => {
      try { // fetch the donkeys details
        console.log("Fetching donkey with ID:", donkeyId);
        const donkeysRef = collection(db, "donkeys");
        const q = query(donkeysRef, where("id", "==", donkeyId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docSnapshot = querySnapshot.docs[0];
          const donkeyData = docSnapshot.data();
          //console.log("Document data:", docSnapshot.data()); 
          setDonkey({ firestoreId: docSnapshot.id, ...donkeyData,
            location: donkeyData.location ? {
              latitude: parseFloat(donkeyData.location.split(',')[0]),
              longitude: parseFloat(donkeyData.location.split(',')[1])
            } : null
           });
           setSelectedLocation(donkeyData.location ? {
            latitude: parseFloat(donkeyData.location.split(',')[0]),
            longitude: parseFloat(donkeyData.location.split(',')[1])
          } : null);
        } else {
          console.log("No such document!");
          Alert.alert("Error", "Donkey not found. Please check the ID and try again.");
          navigation.goBack();
        }
      } catch (error) {
        console.error("Error fetching donkey:", error); 
        Alert.alert("Error", "Failed to fetch donkey details: " + error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchDonkey();
  }, [donkeyId, navigation]);

  const handleMapPress = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
    setDonkey(prevDonkey => ({
      ...prevDonkey,
      location: `${latitude},${longitude}`
    }));
  };

  const handleUpdate = async () => {
    if (!donkey) {
      Alert.alert("Error", "No donkey data to update");
      return;
    }
  
    setLoading(true);
    try {
      const donkeysRef = collection(db, "donkeys");
      const q = query(donkeysRef, where("id", "==", donkeyId));
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        const docToUpdate = querySnapshot.docs[0];
        await updateDoc(docToUpdate.ref, {
          name: donkey.name,
          age: donkey.age,
          gender: donkey.gender,
          health: donkey.healthStatus,
          owner: donkey.owner,

        });
        // Navigate to confirmation screen after update
        navigation.navigate('Edit Confirmation', { donkey });
  
      } else {
        throw new Error("Donkey not found");
      }
    } catch (error) {
      console.error("Error updating donkey:", error);
      Alert.alert("Error", "Failed to update donkey details: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  

  if (loading) return <Text>Loading... </Text>; // this is the loading screen when a user clicks the edit button and save changes button
  if (!donkey) return <Text>No donkey data available</Text>;

  return (// Standardized menustrip and below is the labels and textboxes that displays the donkeys information
    <ScrollView style={styles.scrollView}>
    <View style={styles.menuStrip}>
      <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.buttonTextCust}>Return to Home</Text>
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

    <View style={styles.container}>
    <Text style={styles.title}>Edit the Donkey's Details</Text>
      
        <Text style={styles.label}>Name:</Text>
        <TextInput
          style={styles.input}
          value={donkey.name}
          onChangeText={(text) => setDonkey({ ...donkey, name: text })}
          placeholder="Donkey's Name" />


        <Text style={styles.label}>Gender:</Text>
         <RNPickerSelect
          onValueChange={(value) => setDonkey({ ...donkey, gender: value })} // we used a picker for the user to select the gender for consistency
          items={[
         { label: 'Male', value: 'Male' },
         { label: 'Female', value: 'Female' },
         ]}
          style={pickerSelectStyles}
          value={donkey.gender}  />
   

      
  <Text style={styles.label}>Age:</Text>
  <RNPickerSelect
    onValueChange={(value) => setDonkey({ ...donkey, age: value })}
    items={[
      { label: '< 12 months', value: '< 12 months' },
      { label: '1-5 years', value: '1-5yrs' },
      { label: '6-10 years', value: '6-10yrs' },
      { label: 'Older than 10 years', value: 'older than 10yrs' },
      { label: 'Unknown', value: 'unknown' },
    ]}
    style={pickerSelectStyles}
    value={donkey.age}  />
        <Text style={styles.label}>Owner's Name:</Text>
        <TextInput
          style={styles.input}
          value={donkey.owner}
          onChangeText={(text) => setDonkey({ ...donkey, owner: text })}
          placeholder="Owner's Name"
        />
      <Text style={styles.label}>Location:</Text>
        <TextInput
          style={styles.input}
          value={donkey.location}
          editable={false}
          placeholder="Select location on map"
        />
        <MapView
            style={styles.map}
            initialRegion={{
              latitude: selectedLocation?.latitude || -23.14064265296368,
              longitude: selectedLocation?.longitude || 28.99409628254349,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            onPress={handleMapPress}
          >
            {selectedLocation && <Marker coordinate={selectedLocation} />}
        </MapView> 
      <Text style={styles.label}>Health Status:</Text>
  <RNPickerSelect
    onValueChange={(value) => setDonkey({ ...donkey, health: value })} // we used a picker here for the health status for consistency purposes and validation purposes
    items={[
      { label: 'Good', value: 'Good' },
      { label: 'Mild', value: 'Mild' },
      { label: 'Serious', value: 'Serious' },
    ]}
    style={pickerSelectStyles}
    value={donkey.health}  // This binds the picker to the health status in the donkey state
  />
 
     
 <TouchableOpacity style={styles.button} onPress={handleUpdate} disabled={loading}>  
          <Text style={styles.buttonText}>Save Changes</Text> 
      </TouchableOpacity>
   
   </View>
   
 </ScrollView>
  );
};

export default EditDonkeyScreen;

const styles = StyleSheet.create({ // Here we edited the UI
  container: {
    flex: 1,
    padding: 10,
    
    backgroundColor: 'beige',
  },
  fieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingRight: 0,
  },
  scrollView:{
      paddingHorizontal: 0,
  },
  label: {
    width: 150, 
    fontSize: 16,
    color: '#AD957E',
    fontWeight: 'bold',
    marginRight: 10,
  },
  input: {
    height: 35,
    borderColor: '#AD957E',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 4, 
    maxWidth: 400,
    width: '70%',
    marginTop: 5,
  },
  buttonTextCust: {
    color: '#FFF',
    fontSize: 12,
    textAlign: 'center',
  },
  map: {
    width: '100%',
    height: 300,
    marginVertical: 10,
  },
  menuStrip: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: 'rgba(173, 149, 126, 0.75)', 
  },
  menuButton: {
    padding: 5,
    borderRadius: 5,
    backgroundColor: '#AD957E',
  },
  customButton: {
    backgroundColor: '#AD957E',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
 title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#AD957E',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#AD957E',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 14,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#AD957E',
    borderRadius: 4,
    color: 'black',
    backgroundColor: '#fff',
    marginBottom: 10,
    width:235,
    marginTop: 5,
  },
  inputAndroid: {
    fontSize: 14,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#AD957E',
    borderRadius: 4,
    color: 'black',
    backgroundColor: '#fff',
    marginBottom: 10,
    width:'100%',
    marginTop: 5,
  },
});