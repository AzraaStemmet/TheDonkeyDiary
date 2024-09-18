import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, pickerSelectStyles, TouchableOpacity } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';

const DonkeyReport = () => {
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Home'); // Navigate to Home or Login screen after sign out
    } catch (error) {
      Alert.alert('Sign Out Error', 'Unable to sign out. Please try again later.');
    }};
  const [donkeys, setDonkeys] = useState([]);
  const [filteredDonkeys, setFilteredDonkeys] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGender, setFilterGender] = useState('');
  const [filterAge, setFilterAge] = useState('');

  useEffect(() => {
    const fetchDonkeys = async () => {
      const querySnapshot = await getDocs(collection(db, "donkeys"));
      const donkeyList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDonkeys(donkeyList);
      setFilteredDonkeys(donkeyList);
    };
    fetchDonkeys();
  }, []);

  useEffect(() => {
    filterDonkeys();
  }, [searchQuery, donkeys, filterGender, filterAge]);

  const filterDonkeys = () => {
    let filtered = donkeys.filter(donkey => {
      return donkey.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
             (filterGender ? donkey.gender.toLowerCase() === filterGender.toLowerCase() : true) &&
            // (filterAge ? donkey.age.toLowerCase() === filterAge.toLowerCase() : true) 
             (filterAge ? checkAgeRange(donkey.age, filterAge) : true);
    });
    setFilteredDonkeys(filtered);
  };

  const checkAgeRange = (age, range) => {
    // Assumes age is stored as a number in the database
    switch (range) {
      case '< 12 months': return age < 1;
      case '1 year': return age >= 1;
      case '2 years': return age >= 2;
      case '3 years': return age >= 3;
      default: return true;
    }
  };

  return (
    <ScrollView style={styles.scrollView}>
        <View style={styles.menuStrip}>
          <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('RegisterDonkey')}>
            <Text style={styles.buttonTextCust}>Register Donkey</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('SearchDonkey')}>
            <Text style={styles.buttonTextCust}>Search by ID</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('ViewReports')}>
            <Text style={styles.buttonTextCust}>View Reports</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton} onPress={handleSignOut}>
            <Text style={styles.buttonTextCust}>Sign Out</Text>
          </TouchableOpacity>
        </View>
    <ScrollView style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <RNPickerSelect
        onValueChange={(value) => setFilterGender(value)}
        items={[
          { label: 'Male', value: 'male' },
          { label: 'Female', value: 'female' },
          { label: 'All', value: '' },
        ]}
        style={pickerSelectStyles}
        placeholder={{ label: "Filter Gender", value: '' }}
      />
      <RNPickerSelect
        onValueChange={(value) => setFilterAge(value)}
        items={[
          { label: 'Under 1 year', value: '< 12 months' },
          { label: '1 year', value: '1 year' },
          { label: '2 years', value: '2 years' },
          { label: 'All Ages', value: '' },
        ]}
        style={pickerSelectStyles}
        placeholder={{ label: "Filter Age", value: null }}
      />
      
      <ScrollView horizontal={true}>
        <View style={styles.table}>
          <ScrollView horizontal={true}>
            <View style={styles.headerRow}>
              <Text style={styles.header}>Donkey Name</Text>
              <Text style={styles.header}>Age</Text>
              <Text style={styles.header}>Gender</Text>
              <Text style={styles.header}>Health Status</Text>
              <Text style={styles.header}>Location</Text>
              <Text style={styles.header}>Owner</Text>
              <Text style={styles.header}>ID</Text>
            </View>
          </ScrollView>
          {filteredDonkeys.map((donkey) => (
            <ScrollView horizontal={true} key={donkey.id} style={styles.row}>
              <Text style={styles.cell}>{donkey.name}</Text>
              <Text style={styles.cell}>{donkey.age}</Text>
              <Text style={styles.cell}>{donkey.gender}</Text>
              <Text style={styles.cell}>{donkey.health}</Text>
              <Text style={styles.cell}>{donkey.location}</Text>
              <Text style={styles.cell}>{donkey.owner}</Text>
              <Text style={styles.cell}>{donkey.id}</Text>
            </ScrollView>
          ))}
        </View>
      </ScrollView>
    </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
      backgroundColor: '#f5f5dc',
    },
    containers: {
      width: '100%', // Adjust as needed
      maxWidth: 400, // Maximum width for large screens
      padding: 20, // Add padding if needed
      backgroundColor: 'rgba(255, 255, 255, 0.8)', // Slightly transparent for readability
      borderRadius: 10, // Rounded corners
    },
    customButton: {
      backgroundColor: '#AD957E',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      marginBottom: 10,
    },
    buttonTextCust: {
      color: '#FFF',
      fontSize: 12,
      textAlign: 'center',
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
    searchInput: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 20,
      paddingHorizontal: 10,
      backgroundColor: '#fff',
    },
    table: {
      minWidth: 700, // Ensure the table has a minimum width
    },
    headerRow: {
      flexDirection: 'row',
      backgroundColor: '#AD957E',
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
      minWidth: 120, // Ensure all headers have a minimum width
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#ffffff',
      padding: 5,
      minWidth: 120,
    },
    cell: {
      flex: 1,
      fontSize: 14,
      textAlign: 'center',
      padding: 5,
      minWidth: 120,
    },
    scrollableContent: {
      flexDirection: 'column',
    },
    pickerSelectStyles: {
      inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30,
        backgroundColor: '#fff',
        marginBottom: 10,
      },
      inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: 'purple',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30,
        backgroundColor: '#fff',
      },
      
    }
  });

export default DonkeyReport;