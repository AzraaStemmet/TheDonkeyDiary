import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Button, Alert, ImageBackground, background} from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig'; 
import { useNavigation, useRoute } from '@react-navigation/native';

const RegistrationConfirmationScreen = ({ route, navigation }) => {
  const { donkey } = route.params;
  
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.navigate('HomeScreen'); // Navigate to Home or Login screen after sign out
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
  

  
  return (
    <ImageBackground source={background} style={styles.background} resizeMode="cover">
      <View style={styles.menuStrip}>

        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Home', { reset: true })}>
          <Text style={styles.buttonTextCust}>Return to Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Register for Donkey')}>
          <Text style={styles.buttonTextCust}>Register for Donkey</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Search for Donkey')}>
          <Text style={styles.buttonTextCust}>Search for Donkey</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuButton} onPress={handleSignOut}>
          <Text style={styles.buttonTextCust}>Sign Out</Text>
        </TouchableOpacity>
        
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Donkey has been Sucessfully Registered!</Text>
        <Text style={styles.label}>Please confirm the donkey Details</Text>
        {donkey.imageUrl ? (
          <Image
            source={{ uri: donkey.imageUrl }}
            style={styles.donkeyImage}
          />
        ) : (
          <Text>No image available</Text>
        )}
        <View style={styles.detailsContainer}>
          <View style={styles.column}>
            <Text style={styles.detailsText}>   ID:</Text>
            <Text style={styles.detailsText}>   Name:</Text>
            <Text style={styles.detailsText}>   Gender:</Text>
            <Text style={styles.detailsText}>   Age:</Text>
            <Text style={styles.detailsText}>   Location:</Text>
            <Text style={styles.detailsText}>   Owner:</Text>
            <Text style={styles.detailsText}>   Health Status:</Text>
            <Text style={styles.detailsText}>   Symptoms:</Text>
            <Text style={styles.detailsText}>   Other Symptoms:</Text>
            <Text style={styles.detailsText}>   Medication:</Text>
            <Text style={styles.detailsText}>   Medication Date:</Text>
            <Text style={styles.detailsText}>   Medical Record:</Text>
            <Text style={styles.detailsText}>   Last Checkup Date:</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.detailsValue}>{donkey.id}</Text>
            <Text style={styles.detailsValue}>{donkey.name}</Text>
            <Text style={styles.detailsValue}>{donkey.gender}</Text>
            <Text style={styles.detailsValue}>{donkey.age}</Text>
            <Text style={styles.detailsValue}>{donkey.location}</Text>
            <Text style={styles.detailsValue}>{donkey.owner}</Text>
            <Text style={styles.detailsValue}>{donkey.healthStatus}</Text>
            <Text style={styles.detailsValue}>{donkey.symptoms}</Text>
            <Text style={styles.detailsValue}>{donkey.othersymptoms}</Text>
            <Text style={styles.detailsValue}>{donkey.medication}</Text>
            <Text style={styles.detailsValue}>{donkey.medicationDate?.toLocaleDateString()}</Text>
            <Text style={styles.detailsValue}>{donkey.medicalRecord}</Text>
            <Text style={styles.detailsValue}>{donkey.lastCheckup?.toLocaleDateString()}</Text>

          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.customButton, { marginTop: 10 }]}  onPress={() => navigation.navigate('Home')}>
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
  donkeyImage: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 10,
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
      backgroundColor: 'rgba(173, 149, 126, 0.75)', // consistent menustrip
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
      justifyContent: 'center',  
      paddingVertical: 10,
      marginBottom: 20,
    },
    column: {
      flex: 1,                   // Each column takes up 50% of the width
      paddingHorizontal: 0.5,
    },
    detailsText: {
      fontSize: 16,              // Label font size
      color: '#000000',             // White text 
      marginBottom: 10,          
      textAlign: 'left', 
      paddingVertical: 12,       // Align labels to the right
    },
    detailsValue: {
      fontSize: 16,              
      color: '#000000',             
      marginBottom: 10,          
      textAlign: 'left',         
      borderWidth: 1,            
      borderColor: '#000',       // Black border color
      padding: 8,                
      borderRadius: 5,           // Rounded corners 
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
