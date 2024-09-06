import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

const EditDonkeyScreen = ({ route, navigation }) => {
  const { donkeyId } = route.params;
  const [donkey, setDonkey] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonkey = async () => {
      const donkeysRef = collection(db, "donkeys");
      const q = query(donkeysRef, where("id", "==", donkeyId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docSnapshot = querySnapshot.docs[0];
        setDonkey({ firestoreId: docSnapshot.id, ...docSnapshot.data() });
      } else {
        Alert.alert("Error", "Donkey not found. Please check the ID and try again.");
        navigation.goBack();
      }
      setLoading(false);
    };
  
    fetchDonkey();
  }, [donkeyId, navigation]);

  const handleUpdate = async () => {
    if (!donkey) {
      Alert.alert("Error", "No donkey data to update");
      return;
    }

    setLoading(true);
    const donkeysRef = collection(db, "donkeys");
    const q = query(donkeysRef, where("id", "==", donkeyId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docToUpdate = querySnapshot.docs[0];
      await updateDoc(docToUpdate.ref, donkey);
      Alert.alert("Success", "Donkey details updated successfully");
      navigation.goBack();
    } else {
      Alert.alert("Error", "Failed to find donkey to update");
    }
    setLoading(false);
  };

  if (loading) return <Text>Loading...</Text>;
  if (!donkey) return <Text>No donkey data available</Text>;

  return (
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#faf4c0',
  },
  input: {
    height: 40,
    borderColor: '#AD957E',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#AD957E',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default EditDonkeyScreen;
