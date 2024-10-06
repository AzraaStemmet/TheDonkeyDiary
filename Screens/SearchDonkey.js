import React, { useState, useEffect } from 'react';
import { TextInput, TouchableOpacity, Text, View, StyleSheet, Alert, FlatList, ScrollView, Image } from 'react-native';
import { collection, query, where, getDocs, startAt, endAt, orderBy } from 'firebase/firestore';
import { useNavigation, useRoute } from '@react-navigation/native';
import { db } from '../firebaseConfig';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig'; 
import { printToFileAsync } from 'expo-print';
import { shareAsync } from 'expo-sharing'; // importing dependencies for functionaltities of the applciation 
import { Timestamp } from 'firebase/firestore';


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
      navigation.navigate('Welcome'); // Navigate to Home or Login screen after sign out
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
    generateUniqueId();
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
        // Fetch all fields from the donkey document
        const donkeyDoc = await getDocs(query(collection(db, 'donkeys'), where('id', '==', donkey.id)));
        if (!donkeyDoc.empty) {
          const donkeyData = donkeyDoc.docs[0].data();
          setDonkeyDetails(donkeyData);
        } else {
          setError('No matching donkey found.');
        }
      } else {
        setError('No matching donkey found.');
      }
    } catch (error) {
      console.error("Error searching for donkey:", error);
      setError('Error searching for donkey');
    }
  };
  // code that generates the pdf with all the information previously fetched 
  const generatePDF = async () => { 
    if (!donkeyDetails) return;

    const htmlContent = `
      <html>
      <head><style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { color: #623d23; }
        h2 { color: black}
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        table, th, td { border: 1px solid #623d23; padding: 10px; }
        th { background-color: #623d23; color: white; }
      </style></head>
      <body>
        <h1>The Donkey Diary</h1>
        <h2>Donkey Details</h2>
        <p><strong>Name:</strong> ${donkeyDetails.name}</p>
        <p><strong>Age:</strong> ${donkeyDetails.age}</p>
        <p><strong>Owner:</strong> ${donkeyDetails.owner}</p>
        <p><strong>Healthcare Worker:</strong> ${donkeyDetails.healthcareWorker}</p>
        <p><strong>Location:</strong> ${donkeyDetails.location}</p>
        <p><strong>Gender:</strong> ${donkeyDetails.gender}</p>
        ${donkeyDetails.imageUrl ? `<p><strong>Special Characteristic:</strong><br><img src="${donkeyDetails.imageUrl}" alt="Donkey Image" style="max-width: 300px; height: auto;" /></p>` : '<p>No image available</p>'}
        <h2>Health Details</h2>
        <p><strong>Health Status:</strong> ${donkeyDetails.healthStatus}</p>
        <p><strong>Symptoms:</strong> ${donkeyDetails.symptoms}</p>
        <p><strong>Other Symptoms:</strong> ${donkeyDetails.othersymptoms}</p>
        <p><strong>Medication:</strong> ${donkeyDetails.medication}</p>
        <p><strong>Medication Date:</strong> ${donkeyDetails.medicationDate ? new Date(donkeyDetails.medicationDate).toLocaleDateString() : 'N/A'}</p>
        <p><strong>Medical Record:</strong> ${donkeyDetails.medicalRecord}</p>
        
      </body>
      </html>
    `;

    try {
        const file = await printToFileAsync({
            html: htmlContent,
            base64: false,
        });

        // Share the generated PDF
        await shareAsync(file.uri);
    } catch (error) {
        console.error('Error generating PDF:', error);
        Alert.alert('Error', 'Unable to generate PDF.');
    }
};


  return (
    <ScrollView style={styles.scrollView}>
        <View style={styles.menuStrip}>
          <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Home', { reset: true })}>
            <Text style={styles.buttonTextCust}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Register Donkey')}>
            <Text style={styles.buttonTextCust}>Register Donkey</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Search for Donkey')}>
            <Text style={styles.buttonTextCust}>Search for Donkey</Text>
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
      
      {error ? <Text>{error}</Text> : null}
      {donkeyDetails ? (
        <View>
          {donkeyDetails.imageUrl && (
            <Image
              source={{ uri: donkeyDetails.imageUrl }}
              style={styles.donkeyImage}
            />
          )}
          
          <Text>Donkey Details</Text>
            <Text>Donkey Name: {donkeyDetails.name}</Text>
            <Text>Donkey Age: {donkeyDetails.age}</Text>
            <Text>Donkey Owner: {donkeyDetails.owner}</Text>
            <Text>Health Care Worker: {donkeyDetails.healthcareWorker}</Text>
            <Text>Location: {donkeyDetails.location}</Text>
            <Text>Gender: {donkeyDetails.gender}</Text>
            <Text>          Health Details         </Text>
            <Text>Health Status: {donkeyDetails.healthStatus}</Text>
            <Text>Symptoms: {donkeyDetails.symptoms}</Text>
            <Text>Other Symptoms: {donkeyDetails.othersymptoms}</Text>
            <Text>Medication: {donkeyDetails.medication}</Text>
            <Text>Medication Date: {donkeyDetails.medicationDate ? new Date(donkeyDetails.medicationDate).toLocaleDateString() : 'N/A'}</Text>
            <Text>Medical Record: {donkeyDetails.medicalRecord}</Text>
            
            
          <TouchableOpacity style={styles.pdfButton} onPress={generatePDF}>
           <Text style={styles.pdfButtonText}>Export as PDF</Text>
         </TouchableOpacity>
        </View>
      ) : (
        <Text>No donkey details to display</Text>
      )}

      
    </ScrollView>    
    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5dc', // Consistent with other screens
  },
  donkeyImage: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  pdfButton: {
    marginTop:10,
    backgroundColor: '#AD957E',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pdfButtonText: {
    color: '#FFF8E1',
    fontSize: 16,
    fontWeight: 'bold',
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
    width: '100%', 
    maxWidth: 400, 
    padding: 20, 
    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
    borderRadius: 10, 
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
  background: {
    flex: 1,
    backgroundColor: '#f5f5dc',
  },
});

export default SearchDonkey;
