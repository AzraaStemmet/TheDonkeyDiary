import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, Button, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig'; 
import RNPickerSelect from 'react-native-picker-select';

const EditDonkeyScreen = ({ route, navigation }) => {
  const { donkeyId } = route.params;
  const [donkey, setDonkey] = useState(null);
  const [loading, setLoading] = useState(true);
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Welcome'); // Navigate to Home or Login screen after sign out
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




  useEffect(() => {
    const fetchDonkey = async () => {
      try {
        console.log("Fetching donkey with ID:", donkeyId); // Debug log
        const donkeysRef = collection(db, "donkeys");
        const q = query(donkeysRef, where("id", "==", donkeyId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docSnapshot = querySnapshot.docs[0];
          console.log("Document data:", docSnapshot.data()); // Debug log
          setDonkey({ firestoreId: docSnapshot.id, ...docSnapshot.data() });
        } else {
          console.log("No such document!");
          Alert.alert("Error", "Donkey not found. Please check the ID and try again.");
          navigation.goBack();
        }
      } catch (error) {
        console.error("Error fetching donkey:", error); // More detailed error log
        Alert.alert("Error", "Failed to fetch donkey details: " + error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchDonkey();
  }, [donkeyId, navigation]);

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
          health: donkey.health,
          location: donkey.location,
          owner: donkey.owner
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
  

  if (loading) return <Text>Loading...</Text>;
  if (!donkey) return <Text>No donkey data available</Text>;

  return (
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


    <View style={styles.container}>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Name:</Text>
        <TextInput
          style={styles.input}
          value={donkey.name}
          onChangeText={(text) => setDonkey({ ...donkey, name: text })}
          placeholder="Donkey Name"
        />
      </View>

      <View style={styles.fieldContainer}>
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
    value={donkey.age}  // This binds the picker to the age in the donkey state
  />
</View>

      <View style={styles.fieldContainer}>
  <Text style={styles.label}>Gender:</Text>
  <RNPickerSelect
    onValueChange={(value) => setDonkey({ ...donkey, gender: value })}
    items={[
      { label: 'Male', value: 'Male' },
      { label: 'Female', value: 'Female' },
    ]}
    style={pickerSelectStyles}
    value={donkey.gender}  // This binds the picker to the gender in the donkey state
  />
</View>

      <View style={styles.fieldContainer}>
      <Text style={styles.label}>Health Status:</Text>
  <RNPickerSelect
    onValueChange={(value) => setDonkey({ ...donkey, health: value })}
    items={[
      { label: 'Good', value: 'Good' },
      { label: 'Mild', value: 'Mild' },
      { label: 'Serious', value: 'Serious' },
    ]}
    style={pickerSelectStyles}
    value={donkey.health}  // This binds the picker to the health status in the donkey state
  />
</View>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Location:</Text>
        <TextInput
          style={styles.input}
          value={donkey.location}
          onChangeText={(text) => setDonkey({ ...donkey, location: text })}
          placeholder="Location"
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Owner:</Text>
        <TextInput
          style={styles.input}
          value={donkey.owner}
          onChangeText={(text) => setDonkey({ ...donkey, owner: text })}
          placeholder="Owner"
        />
    </View>
 
      <TouchableOpacity style={styles.button} onPress={handleUpdate} disabled={loading}>
          <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
        </View>
        
  </View>

    </ScrollView>

  );
};

export default EditDonkeyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    height: 800,
    
    backgroundColor: 'beige',
  },
  fieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    
  },
  label: {
    width: 100, // Adjust the width as needed
    fontSize: 16,
    color: '#AD957E',
    fontWeight: 'bold',
    marginRight: 10,
  },

  input: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#AD957E',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
    backgroundColor: '#fff',
    marginBottom: 10,
    fontSize: 15,
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
    color: '#AD957E'
  },
  button: {
    backgroundColor: '#AD957E',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#FFF8E1',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#AD957E',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
    backgroundColor: '#fff',
    marginBottom: 10,
    fontSize: 15,
    
    

  },
  inputAndroid: {
    
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
    backgroundColor: '#fff',
    marginBottom: 10,
    fontSize: 15,
    
  },
});
