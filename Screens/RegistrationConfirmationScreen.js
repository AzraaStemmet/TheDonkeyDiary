import React, { useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert, ImageBackground, background, Image } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig'; 
import Toast from 'react-native-toast-message';

const RegistrationConfirmationScreen = ({ route, navigation }) => {
  const { donkey } = route.params;

  useEffect(() => {
    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: 'Donkey loaded successfully',
      visibilityTime: 3000,
      autoHide: true,
      topOffset: 30,
      bottomOffset: 40,
    });
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.navigate('HomeScreen'); // Navigate to Home or Login screen after sign out
    } catch (error) {
      Alert.alert('Sign Out Error', 'Unable to sign out. Please try again later.');
    }
  };

  return (
    <ImageBackground source={background} style={styles.background} resizeMode="cover">
      <View style={styles.menuStrip}>
        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Home', { reset: true })}>
          <Text style={styles.menuButtonText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Register for Donkey')}>
          <Text style={styles.menuButtonText}>Register for Donkey</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Search for Donkey')}>
          <Text style={styles.menuButtonText}>Search for Donkey</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuButton} onPress={handleSignOut}>
          <Text style={styles.menuButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Donkey has been Successfully Registered!</Text>
        <Text style={styles.label}>Please confirm the donkey details</Text>

        {donkey.imageUrl ? (
          <Image source={{ uri: donkey.imageUrl }} style={styles.donkeyImage} />
        ) : (
          <Text>No image available</Text>
        )}
      <View style={styles.detailsContainer}>
        <View style={styles.row}>
          <Text style={styles.detailsText}>ID:</Text>
          <Text style={styles.detailsValue}>{donkey.id}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.detailsText}>Name:</Text>
          <Text style={styles.detailsValue}>{donkey.name}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.detailsText}>Gender:</Text>
          <Text style={styles.detailsValue}>{donkey.gender}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.detailsText}>Age:</Text>
          <Text style={styles.detailsValue}>{donkey.age}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.detailsText}>Location:</Text>
          <Text style={styles.detailsValue}>{donkey.location}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.detailsText}>Owner:</Text>
          <Text style={styles.detailsValue}>{donkey.owner}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.detailsText}>Health Status:</Text>
          <Text style={styles.detailsValue}>{donkey.healthStatus}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.detailsText}>Symptoms:</Text>
          <Text style={styles.detailsValue}>{donkey.symptoms}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.detailsText}>Other Symptoms:</Text>
          <Text style={styles.detailsValue}>{donkey.othersymptoms}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.detailsText}>Medication:</Text>
          <Text style={styles.detailsValue}>{donkey.medication}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.detailsText}>Medication Date:</Text>
          <Text style={styles.detailsValue}>
            {donkey.medicationDate ? new Date(donkey.medicationDate).toLocaleDateString() : 'Not specified'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.detailsText}>Medical Record:</Text>
          <Text style={styles.detailsValue}>{donkey.medicalRecord}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.detailsText}>Last Checkup Date:</Text>
          <Text style={styles.detailsValue}>
            {donkey.lastCheckup ? new Date(donkey.lastCheckup).toLocaleDateString() : 'Not specified'}
          </Text>
        </View>
      </View>.0

        <TouchableOpacity style={styles.customButton} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.customButtonText}>Return to Home</Text>
        </TouchableOpacity>
      </ScrollView>
      <Toast />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  menuStrip: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: 'rgba(173, 149, 126, 0.75)',
  },
  menuButton: {
    padding: 5,
    borderRadius: 5,
    backgroundColor: '#AD957E',
  },
  menuButtonText: {
    color: '#FFF',
    fontSize: 12,
    textAlign: 'center',
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#f5f5dc',
  },
 
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#AD957E',
    textAlign: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
    color: '#AD957E',
    textAlign: 'center',
    marginBottom: 15,
  },
  donkeyImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 10,
  },
  column: {
    flex: 1,                          // Ensure both columns take equal space
    paddingHorizontal: 10,
  },
  detailsContainer: {
    paddingHorizontal: 6,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',          // Make sure each field has label and value in one row
    alignItems: 'flex-start',      // Align items to the top in case of multi-line text
    marginBottom: 10,
  },
  detailsText: {
    fontSize: 16,
    color: '#000',
    width: 130,                   // Fixed width for labels to prevent overlap
    textAlign: 'left',            // Align text to the left
    marginTop: 4,
  },
  detailsValue: {
    fontSize: 14,
    color: '#000',
    flex: 1,                      // Let values take up the remaining space
    borderWidth: 1,
    borderColor: '#000',
    padding: 8,
    borderRadius: 5,
    textAlign: 'right',           // Align values to the right
    flexWrap: 'wrap',             // Ensure multi-line values wrap correctly
  },
  customButton: {
    backgroundColor: '#AD957E',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  customButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
});

export default RegistrationConfirmationScreen;