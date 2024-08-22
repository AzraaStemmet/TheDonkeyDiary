import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig'; // Ensure db is correctly imported from your Firebase configuration

const DonkeyReportScreen = () => {
  const [donkeys, setDonkeys] = useState([]);

  useEffect(() => {
    const fetchDonkeys = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "donkeys"));
        const donkeyList = [];
        querySnapshot.forEach((doc) => {
          donkeyList.push({ id: doc.id, ...doc.data() });
        });
        setDonkeys(donkeyList);
      } catch (error) {
        console.error("Error fetching donkeys:", error);
      }
    };

    fetchDonkeys();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {donkeys.map((donkey, index) => (
        <View key={donkey.id} style={styles.card}>
          <Text style={styles.title}>Donkey Name: {donkey.name}</Text>
          <Text>Age: {donkey.age}</Text>
          <Text>Gender: {donkey.gender}</Text>
          <Text>Health Status: {donkey.health}</Text>
          <Text>Location: {donkey.location}</Text>
          <Text>Owner: {donkey.owner}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

export default DonkeyReportScreen;

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
});
