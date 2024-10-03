import React, { useState, useEffect } from 'react';
import { TextInput, TouchableOpacity, Text, View, StyleSheet, Alert, FlatList } from 'react-native';
import { collection, query, where, getDocs, startAt, endAt, orderBy } from 'firebase/firestore';
import { useNavigation, useRoute } from '@react-navigation/native';
import { db } from './firebaseConfig';
import { signOut } from 'firebase/auth';
import { auth } from './firebaseConfig'; 

function SearchDonkey() {
  const [searchKey, setSearchKey] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [donkeyDetails, setDonkeyDetails] = useState(null);
  const [error, setError] = useState('');
  
  const navigation = useNavigation();
  const route = useRoute();

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
    // Reset form logic
  };

  useEffect(() => {
    if (searchKey.length >= 2) {
      fetchSuggestions(searchKey);
    } else {
      setSuggestions([]); // Clear suggestions when input is less than 2 characters
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
        const treatmentsSnapshot = await getDocs(collection(db, `healthRecords`), where("donkeyId", "==", donkey.id));
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
      <View style={styles.menuStrip}>
        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('RegisterDonkey', { reset: true })}>
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
  );
}

const styles = StyleSheet.create({
  // Your styles here...
});

export default SearchDonkey;
