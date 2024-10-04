
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Button, ScrollView } from 'react-native';

const EditConfirmationScreen = ({ route, navigation }) => {
  const { donkey } = route.params;

  const handleEditAnotherDonkey = () => {
    navigation.navigate('ViewReports', { reset: true });
  };

  return ( // Standardized menustrip and below is the labels and textboxes that displays the donkeys information
    <ScrollView style={styles.scrollView}>
      <View style={styles.menuStrip}>
        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.buttonTextCust}>Return to Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Register Donkey')}>
          <Text style={styles.buttonTextCust}>Register Donkey</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Search for Donkey')}>
          <Text style={styles.buttonTextCust}>Search for Donkey </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Welcome')}>
          <Text style={styles.buttonTextCust}>Sign out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
  <Text style={styles.title}>Edit Successful!</Text>

  <View style={styles.detailContainerColumn}>
    <Text style={styles.label}>ID:</Text>
    <Text style={styles.input}>{donkey.id}</Text>
  </View>

  <View style={styles.detailContainerColumn}>
    <Text style={styles.label}>Name:</Text>
    <Text style={styles.input}>{donkey.name}</Text>
  </View>

  <View style={styles.detailContainerColumn}>
    <Text style={styles.label}>Gender:</Text>
    <Text style={styles.input}>{donkey.gender}</Text>
  </View>

  <View style={styles.detailContainerColumn}>
    <Text style={styles.label}>Age:</Text>
    <Text style={styles.input}>{donkey.age}</Text>
  </View>

  <View style={styles.detailContainerColumn}>
    <Text style={styles.label}>Owner's Name:</Text>
    <Text style={styles.input}>{donkey.owner}</Text>
  </View>

  <View style={styles.detailContainerColumn}>
    <Text style={styles.label}>Location:</Text>
    <Text style={styles.input}>{donkey.location}</Text>
  </View>

  <View style={styles.detailContainerColumn}>
    <Text style={styles.label}>Health Status:</Text>
    <Text style={styles.input}>{donkey.health}</Text>
  </View>

  <TouchableOpacity style={styles.button} onPress={handleEditAnotherDonkey}>
    <Text style={styles.buttonText}>Edit Another Donkey</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
    <Text style={styles.buttonText}>Return to Home</Text>
  </TouchableOpacity>


        
      </View>
    </ScrollView>
  );
};

export default EditConfirmationScreen;
// Below is editing code, edit the UI. We have a standard color scheme
const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: 'beige',
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
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'beige',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center', 
  },
  button: {
    backgroundColor: '#AD957E',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    width: '100%',
  },
  buttonText: {
    color: '#FFF8E1',
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailContainerColumn: {
    textAlignVertical:'center',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 5,
    textAlignVertical: 'center', 
    textAlign: 'left', 
    paddingHorizontal: 10,
    paddingTop: 10,
    backgroundColor: '#fff',
    borderRadius: 6, // Rounded corners
    maxWidth: 400, // Maximum width for large screens
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#AD957E',
    marginBottom: 5, // Add some space between label and value
  },
  value: {
    fontSize: 16,
    color: '#555', // White 
  },
});