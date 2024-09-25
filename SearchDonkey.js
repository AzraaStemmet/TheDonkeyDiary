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
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Home'); // Navigate to Home or Login screen after sign out
    } catch (error) {
      Alert.alert('Sign Out Error', 'Unable to sign out. Please try again later.');
    }
  };
  const navigation = useNavigation();
  const route = useRoute();

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
    if (searchKey.length >= 2) {
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
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5dc', // Consistent with other screens
  },
  customButton: {
    backgroundColor: '#AD957E',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
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
  containers: {
    width: '100%', // Adjust as needed
    maxWidth: 400, // Maximum width for large screens
    padding: 20, // Add padding if needed
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Slightly transparent for readability
    borderRadius: 10, // Rounded corners
  },
  input: {
    height: 50,
    borderColor: '#AD957E',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#FFFAF0', // Light beige background for input
  },
  resultsContainer: {
    backgroundColor: '#AD957E', // Light beige for the results
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
    color: 'FFF8E1', // Dark brown text for readability
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
   // color: '#AD957E',
  },
  detailValue: {
    color: '#5C5346',
  },
  detailText: {
    fontSize: 16,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#AD957E', // Dark brown color
  },
  treatmentCard: {
    backgroundColor: '#FFFAF0',
    borderRadius: 5,
    padding: 10,
    marginBottom: 5,
  },
  error: {
    color: 'red',
    fontSize: 16,
  },
});

export default SearchDonkey;