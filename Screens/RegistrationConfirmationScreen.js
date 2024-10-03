import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Button, Alert, ImageBackground, background} from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig'; 
import { useNavigation, useRoute } from '@react-navigation/native';

const RegistrationConfirmationScreen = ({ route, navigation }) => {
  // Fallback to avoid error if route.params is undefined
  const { donkey } = route.params;

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

        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Register Donkey', { reset: true })}>
          <Text style={styles.buttonTextCust}>Register Donkey</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Search for Donkey')}>
          <Text style={styles.buttonTextCust}>Search for Donkey</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('View Donkey Reports')}>
          <Text style={styles.buttonTextCust}>View Reports</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuButton} onPress={handleSignOut}>
          <Text style={styles.buttonTextCust}>Sign Out</Text>
        </TouchableOpacity>
        
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Donkey has been Sucessfully Registered!</Text>
        <Text style={styles.label}>Please confirm the donkey Details</Text>
        
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
        <TouchableOpacity style={styles.customButton} onPress={handleConfirmDetails}>
  <Text style={styles.buttonText}>Add Health Record</Text>
</TouchableOpacity>
         
          <TouchableOpacity style={[styles.customButton, { marginTop: 10 }]}  onPress={() => navigation.navigate('Workers')}>
          
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
    padding: 16,
    backgroundColor: 'beige',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    height: 60,
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
