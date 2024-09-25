
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, Button, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { signOut } from 'firebase/auth';
import { auth } from './firebaseConfig'; 

const EditDonkeyScreen = ({ route, navigation }) => {
  const { donkeyId } = route.params;
  const [donkey, setDonkey] = useState(null);
  const [loading, setLoading] = useState(true);
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
        navigation.navigate('EditConfirmation', { donkey });
  
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
      <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('RegisterDonkey')}>
        <Text style={styles.buttonTextCust}>Register Donkey</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('SearchDonkey')}>
        <Text style={styles.buttonTextCust}>Search by ID</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('ViewReports')}>
        <Text style={styles.buttonTextCust}>View Reports</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuButton} onPress={handleSignOut}>
        <Text style={styles.buttonTextCust}>Sign Out</Text>
      </TouchableOpacity>
    </View>

    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={donkey.name}
        onChangeText={(text) => setDonkey({ ...donkey, name: text })}
        placeholder="Donkey Name"
      />
      <TextInput
        style={styles.input}
        value={donkey.age}
        onChangeText={(text) => setDonkey({ ...donkey, age: text })}
        placeholder="Age"
      />
      <TextInput
        style={styles.input}
        value={donkey.gender}
        onChangeText={(text) => setDonkey({ ...donkey, gender: text })}
        placeholder="Gender"
      />
      <TextInput
        style={styles.input}
        value={donkey.health}
        onChangeText={(text) => setDonkey({ ...donkey, health: text })}
        placeholder="Health Status"
      />
      <TextInput
        style={styles.input}
        value={donkey.location}
        onChangeText={(text) => setDonkey({ ...donkey, location: text })}
        placeholder="Location"
      />
      <TextInput
        style={styles.input}
        value={donkey.owner}
        onChangeText={(text) => setDonkey({ ...donkey, owner: text })}
        placeholder="Owner"
      />

      <TouchableOpacity style={styles.button} onPress={handleUpdate} disabled={loading}>
          <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
     
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
    backgroundColor: '#ffe5b6',
  },
  input: {
    height: 40,
    borderColor: '#AD957E',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
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

  button: {
    backgroundColor: '#AD957E',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFF8E1',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
