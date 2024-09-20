import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig'; // Ensure db is correctly imported from your Firebase configuration

const homeBackground = require('./assets/backs.png');
const DonkeyReportScreen = ({ navigation }) => {
  const [donkeys, setDonkeys] = useState([]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Home'); // Navigate to Home or Login screen after sign out
    } catch (error) {
      Alert.alert('Sign Out Error', 'Unable to sign out. Please try again later.');
    }
  };

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
      } catch (error) {
        console.error("Error fetching donkeys:", error);
      }
    };

    fetchDonkeys();
  }, []);

  const renderLocation = (location) => {
    if (!location) return 'No location available';
    const [latitude, longitude] = location.split(', ');
    return `Lat: ${latitude}, Lon: ${longitude}`;
  };

  const background = require('./assets/back.png'); // Ensure this path is correct

  return (
    <ImageBackground
    source={homeBackground}
    style={styles.homeBackground}
    resizeMode="cover" // Ensure the image covers the background properly
  >
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

              <TouchableOpacity
                style={styles.customButton}
                onPress={() => navigation.navigate('EditDonkey', { donkeyId: donkey.id })}
              >
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
        </ImageBackground>
  );
};


const styles = StyleSheet.create({
 
  overlay: {
    width: '100%',
    maxWidth: 600,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Slightly transparent background for readability
    borderRadius: 10, // Rounded corners
  },
  scrollContainer: {
    alignItems: 'center', // Center items horizontally
  },
  container: {
    flex: 1,
    padding: 10,
    width: '100%',

    backgroundColor: 'transparent', // Keep background transparent for overlay effect
  },
  card: {
    backgroundColor: '#FFFAF0', // Light background similar to LoginScreen
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '100%',
  },
  homeBackground: {
    flex: 1, // Ensures ImageBackground covers the entire screen
    justifyContent: 'center', // Centers content vertically
    alignItems: 'center', // Centers content horizontally
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#AD957E',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5C5346',
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
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFF8E1',
    fontSize: 14,
    fontWeight: 'bold',
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
    width: '101%',
    backgroundColor: 'rgba(173, 149, 126, 0.75)', // Semi-transparent background for the menu
  },
  menuButton: {
    padding: 5,
    borderRadius: 5,
    backgroundColor: '#AD957E',
  },
 
});

export default DonkeyReportScreen;
