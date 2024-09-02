import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, Button, Alert } from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebaseConfig'; // Ensure db is correctly imported

const EditDonkeyScreen = ({ route, navigation }) => {
    const { donkeyId, name, age, gender, health, location, owner } = route.params; // Get the donkey ID passed from the previous screen
    const [donkey, setDonkey] = useState({
        name: name, // pre-populate from params
        age: age,   // pre-populate from params
        gender: gender, // pre-populate from params
        health: health, // pre-populate from params
        location: location, // pre-populate from params
        owner: owner,   // pre-populate from params
    });
  const [loading, setLoading] = useState(true);

  useEffect(() => {


    const fetchDonkey = async () => {
      try {
        const docRef = doc(db, "donkeys", donkeyId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setDonkey(docSnap.data());
          console.log("Fetched donkey data:", docSnap.data()); // Debug: Log the fetched donkey data
        } 
      }  finally {
        setLoading(false);
      }
    };

    fetchDonkey();
  }, [donkeyId, navigation]);

  const handleUpdate = async () => {
    try {
      const docRef = doc(db, "donkeys", donkeyId);
      await updateDoc(docRef, {
        name: donkey.name,
        age: donkey.age,
        gender: donkey.gender,
        health: donkey.health,
        location: donkey.location,
        owner: donkey.owner
      });

      Alert.alert("Success", "Donkey details updated successfully");
      navigation.goBack();
    } catch (error) {
      console.error("Error updating donkey:", error);
      Alert.alert("Error", "Failed to update donkey details");
    }
  };

  if (loading) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Donkey Name</Text>
      <TextInput
    style={styles.input}
    value={donkey.name}
    onChangeText={(text) => setDonkey({ ...donkey, name: text })}
    />
      <Text style={styles.label}>Age</Text>
      <TextInput
        style={styles.input}
        value={donkey.age}
        onChangeText={(text) => setDonkey({ ...donkey, age: text })}
        keyboardType="default"
      />
      <Text style={styles.label}>Gender</Text>
      <TextInput
        style={styles.input}
        value={donkey.gender}
        onChangeText={(text) => setDonkey({ ...donkey, gender: text })}
      />
      <Text style={styles.label}>Health Status</Text>
      <TextInput
        style={styles.input}
        value={donkey.health}
        onChangeText={(text) => setDonkey({ ...donkey, health: text })}
      />
      <Text style={styles.label}>Location</Text>
      <TextInput
        style={styles.input}
        value={donkey.location}
        onChangeText={(text) => setDonkey({ ...donkey, location: text })}
      />
      <Text style={styles.label}>Owner</Text>
      <TextInput
        style={styles.input}
        value={donkey.owner}
        onChangeText={(text) => setDonkey({ ...donkey, owner: text })}
      />
      <Button title="Save Changes" onPress={handleUpdate} />
    </View>
  );
};

export default EditDonkeyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#faf4c0',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#AD957E',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});
