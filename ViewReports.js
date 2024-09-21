import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Button, TouchableOpacity } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig'; // Ensure db is correctly imported from your Firebase configuration
import { signOut } from 'firebase/auth';
import { auth } from './firebaseConfig';


const DonkeyReportScreen = ({ navigation }) => {
  const [donkeys, setDonkeys] = useState([]);
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Home'); // Navigate to Home or Login screen after sign out
    } catch (error) {
      Alert.alert('Sign Out Error', 'Unable to sign out. Please try again later.');
    }};

  useEffect(() => {
    const fetchDonkeys = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "donkeys"));
        const donkeyList = [];
        for (const doc of querySnapshot.docs) {
          const donkeyData = doc.data();
          const treatmentsSnapshot = await getDocs(collection(db, `donkeys/${doc.id}/treatments`));
          const treatments = treatmentsSnapshot.docs.map(treatmentDoc => treatmentDoc.data());
          donkeyList.push({ id: doc.id, ...donkeyData, treatments });
        }
        setDonkeys(donkeyList);
        console.log("Fetched donkeys:", donkeyList); // Debug: Log the fetched donkeys
      } catch (error) {
        console.error("Error fetching donkeys:", error);
      }
    };

    fetchDonkeys();
  }, []);

  // Define the renderLocation function
  const renderLocation = (location) => {
    if (!location) return 'No location available';
    const [latitude, longitude] = location.split(', ');
    return `Lat: ${latitude}, Lon: ${longitude}`;
  };


  return (
   
      <ScrollView style={styles.scrollView}>
        <View style={styles.menuStrip}>
          <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('RegisterDonkey')}>
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
      {donkeys.map((donkey) => (
        <View key={donkey.id} style={styles.card}>
          <Text style={styles.title}>Donkey Name: {donkey.name}</Text>
          <Text>Age: {donkey.age}</Text>
          <Text>Gender: {donkey.gender}</Text>
          <Text>Health Status: {donkey.health}</Text>
          <Text>Location: {renderLocation(donkey.location)}</Text>
          <Text>Owner: {donkey.owner}</Text>
          <Text>ID: {donkey.id}</Text>

          <Text style={styles.subtitle}>Treatment Records:</Text>
          {donkey.treatments.length > 0 ? (
            donkey.treatments.map((treatment, index) => (
              <View key={index} style={styles.treatmentCard}>
                <Text>Date: {treatment.date}</Text>
                <Text>Type: {treatment.type}</Text>
                <Text>Notes: {treatment.notes}</Text>
              </View>
            ))
          ) : (
            <Text>No treatment records available.</Text>
          )}

          <Button
            title="Edit"
            onPress={() => {
              console.log("Navigating to EditDonkey with ID:", donkey.id); // Debug: Log the navigation
              navigation.navigate('EditDonkey', { donkeyId: donkey.id });
            }}
          />
        </View>
      ))}
    </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5dc',
  },
  containers: {
    width: '100%', // Adjust as needed
    maxWidth: 400, // Maximum width for large screens
    padding: 20, // Add padding if needed
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Slightly transparent for readability
    borderRadius: 10, // Rounded corners
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
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
});

export default DonkeyReportScreen;