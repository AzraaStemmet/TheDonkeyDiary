import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';

const homeBackground = require('../assets/backs.png');

const DonkeyReportScreen = () => {
  const [donkeys, setDonkeys] = useState([]);
  const navigation = useNavigation();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Welcome');
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
    if (!location || typeof location !== 'string') return 'No location available';
    const [latitude, longitude] = location.split(', ');
    return `Lat: ${latitude}, Lon: ${longitude}`;
  };

  return (
    <ImageBackground
      source={homeBackground}
      style={styles.homeBackground}
      resizeMode="cover"
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.menuStrip}>
          <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Home')}>
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

        {donkeys.map((donkey) => (
          <View key={donkey.id} style={styles.card}>
            <Text style={styles.title}>Donkey Name: {donkey.name}</Text>
            <Text>Age: {donkey.age}</Text>
            <Text>Gender: {donkey.gender}</Text>
            <Text>Location: {renderLocation(donkey.location)}</Text>
            <Text>Owner: {donkey.owner}</Text>
            <Text>ID: {donkey.id}</Text>
            <Text>Health Status: {donkey.healthStatus}</Text>

            {/* Display the donkey's image */}
            {donkey.imageUrl ? (
              <Image source={{ uri: donkey.imageUrl }} style={styles.image} />
            ) : (
              <Text>No image available</Text>
            )}

            <Text>Health Status: {donkey.healthStatus}</Text>
            <Text>Symptoms:  {donkey.symptoms} </Text>
            <Text>Other Symptoms: {donkey.othersymptoms}</Text>
            <Text>Medication: {donkey.medication}</Text>
            <Text>Medication Date: {donkey.medicationDate}</Text>
            <Text>Medical Record: {donkey.medicalRecord}</Text>
            <Text>Last Checkup Date:{donkey.lastCheckup}</Text>



            <TouchableOpacity
              style={styles.customButton}
              onPress={() => navigation.navigate('Edit Donkey Details', { donkeyId: donkey.id })}
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
  homeBackground: {
    flex: 1,
  },
  donkeyImage: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  scrollView: {
    paddingHorizontal: 0,
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
    backgroundColor: '#AD957E',
    borderRadius: 5,
  },
  buttonTextCust: {
    color: '#FFF',
    fontSize: 12,
  },
  card: {
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 10,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 10,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  subtitle: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  customButton: {
    marginTop: 10,
    backgroundColor: '#AD957E',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  treatmentCard: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
});

export default DonkeyReportScreen;