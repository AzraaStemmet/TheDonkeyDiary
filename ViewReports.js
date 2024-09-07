import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Button } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig'; // Ensure db is correctly imported from your Firebase configuration

const DonkeyReportScreen = ({ navigation }) => {
  const [donkeys, setDonkeys] = useState([]);

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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5dc',
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
});

export default DonkeyReportScreen;