import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, Button, Alert } from 'react-native';
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

const EditDonkeyScreen = ({ route, navigation }) => {
  const { donkeyId } = route.params;
  const [donkey, setDonkey] = useState(null);
  const [loading, setLoading] = useState(true);

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

        Alert.alert("Success", "Donkey details updated successfully");
        navigation.goBack();
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
      <Button title="Save Changes" onPress={handleUpdate} disabled={loading} />
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
  input: {
    height: 40,
    borderColor: '#AD957E',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});