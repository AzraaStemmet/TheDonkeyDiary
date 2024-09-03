import React, { useState, useEffect } from 'react';
import { TextInput, Button, Text, View, FlatList, StyleSheet } from 'react-native';
import { collection, query, where, getDocs, startAt, endAt, orderBy } from 'firebase/firestore';
import { db } from './firebaseConfig';

function SearchDonkey() {
  const [searchKey, setSearchKey] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [donkeyDetails, setDonkeyDetails] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (searchKey.length >= 3) {
      fetchSuggestions(searchKey);
    } else {
      setSuggestions([]); // Clear suggestions when input is less than 3 characters
    }
  }, [searchKey]);

  const fetchSuggestions = async (input) => {
    try {
      setError(''); // Clear previous errors
      const nameQuery = query(
        collection(db, "donkeys"),
        orderBy("name"),
        startAt(input),
        endAt(input + "\uf8ff")
      );
      const idQuery = query(
        collection(db, "donkeys"),
        orderBy("id"),
        startAt(input),
        endAt(input + "\uf8ff")
      );

      const [nameSnapshot, idSnapshot] = await Promise.all([getDocs(nameQuery), getDocs(idQuery)]);

      const nameResults = nameSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const idResults = idSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const combinedResults = [...nameResults, ...idResults];
      setSuggestions(combinedResults);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setError('Error fetching suggestions');
    }
  };

  const handleSearch = async (item) => {
    try {
      setError(''); // Clear previous errors
      setDonkeyDetails(null); // Clear previous results

      const donkey = suggestions.find(d => d.name === item.name || d.id === item.id);
      if (donkey) {
        // Fetch treatment records for the selected donkey
        const treatmentsSnapshot = await getDocs(collection(db, `donkeys/${donkey.id}/healthRecords`));
        const treatments = treatmentsSnapshot.docs.map(doc => doc.data());
        setDonkeyDetails({ ...donkey, treatments });
      } else {
        setError('No matching donkey found.');
      }
    } catch (error) {
      console.error("Error searching for donkey:", error);
      setError('Error searching for donkey');
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
      <FlatList
        data={suggestions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={styles.suggestionItem} onPress={() => handleSearch(item)}>
            {item.name} ({item.id})
          </Text>
        )}
      />
      <View>
        {error ? <Text>{error}</Text> : null}
        {donkeyDetails ? (
          <View>
            <Text>Donkey Name: {donkeyDetails.name}</Text>
            <Text>Donkey Age: {donkeyDetails.age}</Text>
            <Text>Donkey Owner: {donkeyDetails.owner}</Text>
            <Text>Location: {donkeyDetails.location}</Text>
            <Text>Breed: {donkeyDetails.breed}</Text>
            <Text>Gender: {donkeyDetails.gender}</Text>
            <Text>Health Status: {donkeyDetails.health}</Text>
            
            <Text style={styles.subtitle}>Treatment Records:</Text>
            {donkeyDetails.treatments && donkeyDetails.treatments.length > 0 ? (
              donkeyDetails.treatments.map((treatment, index) => (
                <View key={index} style={styles.treatmentCard}>
                  <Text>Date: {treatment.lastCheckup?.toDate().toLocaleDateString()}</Text>
                  <Text>Health Status: {treatment.healthStatus}</Text>
                  <Text>Treatment Given: {treatment.treatmentGiven}</Text>
                </View>
              ))
            ) : (
              <Text>No treatment records available.</Text>
            )}
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
    paddingHorizontal: 10,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  treatmentCard: {
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    padding: 10,
    marginBottom: 5,
  },
});

export default SearchDonkey;
