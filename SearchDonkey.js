// this page new, changed the images in app.json
// and app js page the navigator and the workers page the button, and import in app.js
import React, { useState } from 'react';
import { TextInput, Button, Text, View, StyleSheet } from 'react-native';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig'; // Make sure db is properly exported from firebaseConfig

function SearchDonkey() {
  const [searchKey, setSearchKey] = useState('');
  const [donkeyDetails, setDonkeyDetails] = useState(null);

  const db = getFirestore(db); 

  const handleSearch = async () => {
    try {
      const q = query(collection(db, "donkeys"), where("name", "==", searchKey)).or(where("id", "==", searchKey));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setDonkeyDetails(null);
        setError('No matching donkey found.');
        return;
      }

      querySnapshot.forEach(doc => {
        console.log(doc.id, '=>', doc.data());
        setDonkeyDetails(doc.data());
      });
    } catch (error) {
      console.error("Error searching for donkey:", error);
      setDonkeyDetails('Error searching for donkey');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={searchKey}
        onChangeText={setSearchKey}
        placeholder="Enter Donkey Name or ID"
      />
      <Button title="Search" onPress={handleSearch} />
      <View>
        {donkeyDetails ? (
          <View>
            <Text>Donkey Name: {donkeyDetails.name}</Text>
            <Text>Donkey Age: {donkeyDetails.age}</Text>
            <Text>Donkey Owner: {donkeyDetails.owner}</Text>
            <Text>Location: {donkeyDetails.location}</Text>
            <Text>Breed: {donkeyDetails.breed}</Text>
            <Text>Gender: {donkeyDetails.gender}</Text>
            <Text>Health Status: {donkeyDetails.health}</Text>
          </View>
        ) : (
          <Text>No donkey details to display</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
  },
});

export default SearchDonkey;

