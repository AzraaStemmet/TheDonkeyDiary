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

      const nameResults = nameSnapshot.docs.map(doc => doc.data());
      const idResults = idSnapshot.docs.map(doc => doc.data());

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
        setDonkeyDetails(donkey);
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
});

export default SearchDonkey;
