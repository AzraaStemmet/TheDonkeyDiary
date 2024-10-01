import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Button, Alert, ImageBackground, background} from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from './firebaseConfig'; 
import { useNavigation, useRoute } from '@react-navigation/native';

const RegistrationConfirmationScreen = ({ route, navigation }) => {
  const { donkey } = route.params;
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
    setId('');
    setName('');
    setGender('');
    setAge('');
    setLocation('');
    setOwner('');
    setImage('');
    generateUniqueId(); // Generate a new ID when resetting
  };
  const handleConfirmDetails = () => {
    // Proceed to health record screen
    navigation.navigate('Health Records', { donkey });
  };

  
  return (
    <ImageBackground source={background} style={styles.background} resizeMode="cover">
      <View style={styles.menuStrip}>

        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Register Donkey', { reset: true })}>
          <Text style={styles.buttonTextCust}>Register Donkey</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Search for Donkey')}>
          <Text style={styles.buttonTextCust}>Search by ID</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('View Donkey Reports')}>
          <Text style={styles.buttonTextCust}>View Reports</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuButton} onPress={handleSignOut}>
          <Text style={styles.buttonTextCust}>Sign Out</Text>
        </TouchableOpacity>
        
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Donkey Registration Successful</Text>
        <Text style={styles.label}>Confirm Donkey Details</Text>
        
        <View style={styles.detailsContainer}>
          <View style={styles.column}>
            <Text style={styles.detailsText}>   ID:</Text>
            <Text style={styles.detailsText}>   Name:</Text>
            <Text style={styles.detailsText}>   Gender:</Text>
            <Text style={styles.detailsText}>   Age:</Text>
            <Text style={styles.detailsText}>   Location:</Text>
            <Text style={styles.detailsText}>   Owner:</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.detailsValue}>{donkey.id}</Text>
            <Text style={styles.detailsValue}>{donkey.name}</Text>
            <Text style={styles.detailsValue}>{donkey.gender}</Text>
            <Text style={styles.detailsValue}>{donkey.age}</Text>
            <Text style={styles.detailsValue}>{donkey.location}</Text>
            <Text style={styles.detailsValue}>{donkey.owner}</Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Add Health Record" color="#AD957E" onPress={handleConfirmDetails} />
          <TouchableOpacity style={styles.customButton} onPress={() => navigation.navigate('Workers')}>
            <Text style={styles.buttonText}>Return to Home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5dc', // Consistent background color
  },
    background: {
    flex: 1,
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#AD957E', // Consistent theme color
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
    color: '#AD957E',
  },
    background: {
      flex: 1,
      justifyContent: 'center',
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
    
    buttonTextCust: {
      color: '#FFF',
      fontSize: 12,
      textAlign: 'center',
    },
    buttonText: {
      color: '#FFF',
      fontSize: 16,
      textAlign: 'center',
    },
    buttonContainer: {
      justifyContent: 'center',
      paddingHorizontal: 20,
      borderRadius: 5,
    },
    detailsContainer: {
      flexDirection: 'row',      // Align two columns side by side
      justifyContent: 'center',  // Center the content
      paddingVertical: 10,
      marginBottom: 20,
    },
    column: {
      flex: 1,                   // Each column takes up 50% of the width
      paddingHorizontal: 0.5,
    },
    detailsText: {
      fontSize: 16,              // Label font size
      color: '#000000',             // White text for contrast
      marginBottom: 10,          // Spacing between each detail line
      textAlign: 'left', 
      paddingVertical: 12,       // Align labels to the right
    },
    detailsValue: {
      fontSize: 16,              // Value font size
      color: '#000000',             // White text for contrast
      marginBottom: 10,          // Spacing between each value line
      textAlign: 'left',         // Align values to the left
      borderWidth: 1,            // Thin border width
      borderColor: '#000',       // Black border color
      padding: 8,                // Padding inside the border to give it some space
      borderRadius: 5,           // Rounded corners for a more polished look


    },
    
    customButton: {
      backgroundColor: '#AD957E',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      marginBottom: 10,
    },
  });

export default RegistrationConfirmationScreen;
