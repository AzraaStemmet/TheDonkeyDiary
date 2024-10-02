import React, { useState, useEffect } from 'react';
import { TextInput, TouchableOpacity, ScrollView, Text, View, StyleSheet, Alert } from 'react-native';
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

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Home'); // Navigate to Home or Login screen after sign out
    } catch (error) {
      Alert.alert('Sign Out Error', 'Unable to sign out. Please try again later.');
    }
  };

  // Reset form when needed
  useEffect(() => {
    if (route.params?.reset) {
      resetForm();
    }
  }, [route.params]);

  const resetForm = () => {
    setSearchKey('');
    setDonkeyDetails(null);
    setSuggestions([]);
  };

  // Fetch suggestions for the donkey based on name or ID
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

  // Handle the search of a specific donkey
  // Handle the search of a specific donkey
const handleSearch = async (item) => {
  try {
    setError(''); // Clear previous errors
    setDonkeyDetails(null); // Clear previous results

    const donkey = suggestions.find(d => d.name === item.name || d.id === item.id);
    if (donkey) {
      // Fetch treatment records for the selected donkey
      const treatmentsSnapshot = await getDocs(
        query(collection(db, `healthRecords`), where("donkeyId", "==", donkey.id))
      );

      // Check if we got any treatments
      const treatments = treatmentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log("Fetched treatments:", treatments); // Debugging line
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
    <ScrollView style={styles.scrollView}>
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
      <ScrollView style={styles.container}>
        <TextInput
          style={styles.input}
          value={searchKey}
          onChangeText={setSearchKey}
          placeholder="Enter Donkey Name or ID"
          placeholderTextColor="#8A7E72"
        />
        {suggestions.length > 0 && (
          <View style={styles.resultsContainer}>
            {suggestions.map((item) => (
              <TouchableOpacity key={item.id} style={styles.suggestionItem} onPress={() => handleSearch(item)}>
                <Text style={styles.suggestionText}>{item.name} ({item.id})</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {donkeyDetails && (
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.detailHeader}>Name:</Text>
              <Text style={styles.detailValue}>{donkeyDetails.name}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailHeader}>Age:</Text>
              <Text style={styles.detailValue}>{donkeyDetails.age}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailHeader}>Owner:</Text>
              <Text style={styles.detailValue}>{donkeyDetails.owner}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailHeader}>Location:</Text>
              <Text style={styles.detailValue}>{donkeyDetails.location}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailHeader}>Gender:</Text>
              <Text style={styles.detailValue}>{donkeyDetails.gender}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailHeader}>Health Status:</Text>
              <Text style={styles.detailValue}>{donkeyDetails.health}</Text>
            </View>
            {donkeyDetails.treatments.length > 0 ? (
              donkeyDetails.treatments.map((treatment, index) => (
            <View key={index} style={styles.treatmentCard}>
              <Text>Date: {treatment.lastCheckup?.toDate().toLocaleDateString()}</Text>
              <Text>Medication: {treatment.medication}</Text>
              <Text>Treatment Given: {treatment.treatmentGiven}</Text>
            </View>
                  ))
            ) : (
              <Text>No treatment records available.</Text>
            )}
          </View>
        )}
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
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
  buttonTextCust: {
    color: '#FFF',
    fontSize: 12,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5dc',
  },
  input: {
    height: 50,
    borderColor: '#AD957E',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#FFFAF0',
  },
  resultsContainer: {
    backgroundColor: '#AD957E',
    borderRadius: 10,
    paddingVertical: 5,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#AD957E',
  },
  suggestionText: {
    fontSize: 16,
    color: '#FFF8E1',
  },
  detailsContainer: {
    marginTop: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#FFFAF0',
    borderRadius: 5,
    marginBottom: 5,
  },
  detailHeader: {
    fontWeight: 'bold',
  },
  detailValue: {
    color: '#5C5346',
  },
  treatmentCard: {
    backgroundColor: '#FFFAF0',
    borderRadius: 5,
    padding: 10,
    marginBottom: 5,
  },
  error: {
    color: 'red',
    marginVertical: 10,
    textAlign: 'center',
  },
});

export default SearchDonkey;
