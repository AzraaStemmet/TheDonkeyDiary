import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from './firebaseConfig'; // Ensure this path is correct

const WorkersScreen = ({ navigation }) => {
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Home'); // Navigate to Home or Login screen after sign out
    } catch (error) {
      Alert.alert('Sign Out Error', 'Unable to sign out. Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.buttonText}>Home Page</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Workers')}>
          <Text style={styles.buttonText}>Workers Menu</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('RegisterDonkey')}>
          <Text style={styles.buttonText}>Register Donkey</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={handleSignOut}>
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
        <Image style={styles.logo} source={require('./assets/bahananwa.jpg')} />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.customButton} onPress={() => navigation.navigate('RegisterDonkey')}>
          <Text style={styles.buttonText}>Register Donkey</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.customButton} onPress={() => navigation.navigate('SearchDonkey')}>
          <Text style={styles.buttonText}>Search by ID</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.customButton} onPress={() => navigation.navigate('ViewReports')}>
          <Text style={styles.buttonText}>View Existing Donkeys</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.customButton} onPress={() => navigation.navigate('Reports')}>
          <Text style={styles.buttonText}>View Reports</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WorkersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5dc',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    height: 60,
  },
  navButton: {
    padding: 10,
    backgroundColor: '#AD957E',
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFF', // Adjusted for better visibility
    fontSize: 16,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  customButton: {
    backgroundColor: '#AD957E',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
});
