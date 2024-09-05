import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';

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
    <ScrollView style={styles.container} horizontal={true}>
      <View style={styles.table}>
        <View style={styles.headerRow}>
          <Text style={styles.header}>Donkey Name</Text>
          <Text style={styles.header}>Age</Text>
          <Text style={styles.header}>Gender</Text>
          <Text style={styles.header}>Health Status</Text>
          <Text style={styles.header}>Location</Text>
          <Text style={styles.header}>Owner</Text>
          <Text style={styles.header}>ID</Text>
        </View>
        <ScrollView style={styles.scrollableContent} vertical={true}>
          {donkeys.map((donkey) => (
            <View key={donkey.id} style={styles.row}>
              <Text style={styles.cell}>{donkey.name}</Text>
              <Text style={styles.cell}>{donkey.age}</Text>
              <Text style={styles.cell}>{donkey.gender}</Text>
              <Text style={styles.cell}>{donkey.health}</Text>
              <Text style={styles.cell}>{donkey.location}</Text>
              <Text style={styles.cell}>{donkey.owner}</Text>
              <Text style={styles.cell}>{donkey.id}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
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
  table: {
    flexDirection: 'column', // Stack rows vertically
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#8B4513',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  header: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ffffff',
    padding: 5,
    minWidth: 120, // Adjust width as needed
  },
  cell: {
    flex: 1,
    fontSize: 14,
    textAlign: 'center',
    padding: 5,
    minWidth: 120, // Adjust width as needed
  },
  scrollableContent: {
    flexDirection: 'column',
  },
});

