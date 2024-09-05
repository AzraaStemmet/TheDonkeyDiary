import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity,Image, Button, ImageBackground } from 'react-native';
const workerBackground = require('./assets/back.png')
const WorkersScreen = ({ navigation }) => {
  return (
    <ImageBackground
      source={workerBackground}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
    <View style={styles.container}>
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.buttonText}>Home Page</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('WorkersMenu')}>
          <Text style={styles.buttonText}>Workers Menu</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('RegisterDonkey')}>
          <Text style={styles.buttonText}>Register Donkey</Text>
        </TouchableOpacity>
        <Image
          style={styles.logo}
          source={require('./assets/bahananwa.jpg')} 
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Register Donkey"
          onPress={() => navigation.navigate('RegisterDonkey')}
          color="#AD957E"
        />
        <Button
          title="Search by ID"
          onPress={() => navigation.navigate('SearchDonkey')}
          color="#AD957E"
        />
        <Button
          title="View Existing Donkeys"
          onPress={() => navigation.navigate('ViewReports')}
          color="#AD957E"
        />
        <Button
          title="View Reports"
          onPress={() => navigation.navigate('Reports')}
          color="#AD957E"
        />
      </View>
    </View>
    </ImageBackground>
  );
};

export default WorkersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5dc',
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center', // Center items vertically
    alignItems: 'center', // Center items horizontally
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    height: 60, // Fixed height for nav bar
   // backgroundColor: '#faf4c0', // Consistent header background color
  },
  navButton: {
    padding: 10,
    backgroundColor: '#AD957E', // Button background color
    borderRadius: 5,
    borderColor: '#000000',
  },
  buttonText: {
    color: '#000000', // White text for buttons
    fontSize: 16,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
});
