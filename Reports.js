import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, pickerSelectStyles } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';

const DonkeyReport = () => {
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
<<<<<<< HEAD
=======
            // (filterAge ? donkey.age.toLowerCase() === filterAge.toLowerCase() : true) 
>>>>>>> 1221bf62c1cfda97d86e441b33f4f17fb2c3f03a
             (filterAge ? checkAgeRange(donkey.age, filterAge) : true);
    });
    setFilteredDonkeys(filtered);
  };

  const checkAgeRange = (age, range) => {
<<<<<<< HEAD
    // Assumes `age` is stored as a number in the database
=======
    // Assumes age is stored as a number in the database
>>>>>>> 1221bf62c1cfda97d86e441b33f4f17fb2c3f03a
    switch (range) {
      case '< 12 months': return age < 1;
      case '1 year': return age >= 1;
      case '2 years': return age >= 2;
<<<<<<< HEAD
      case '3 years': return age > 3;
=======
      case '3 years': return age >= 3;
>>>>>>> 1221bf62c1cfda97d86e441b33f4f17fb2c3f03a
      default: return true;
    }
  };

  return (
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
<<<<<<< HEAD
        placeholder={{ label: "Select Gender", value: null }}
=======
        placeholder={{ label: "Filter Gender", value: '' }}
>>>>>>> 1221bf62c1cfda97d86e441b33f4f17fb2c3f03a
      />
      <RNPickerSelect
        onValueChange={(value) => setFilterAge(value)}
        items={[
<<<<<<< HEAD
          { label: 'Under 1 year', value: 'under_1' },
          { label: '1 to 3 years', value: '1_to_3' },
          { label: 'Over 3 years', value: 'over_3' },
          { label: 'All Ages', value: '' },
        ]}
        style={pickerSelectStyles}
        placeholder={{ label: "Select Age Range", value: null }}
      />
      <View style={styles.table}>
        {filteredDonkeys.map((donkey) => (
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
      </View>
=======
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
>>>>>>> 1221bf62c1cfda97d86e441b33f4f17fb2c3f03a
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
      backgroundColor: '#f5f5dc',
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
<<<<<<< HEAD
      flexDirection: 'column',
=======
      minWidth: 700, // Ensure the table has a minimum width
>>>>>>> 1221bf62c1cfda97d86e441b33f4f17fb2c3f03a
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
<<<<<<< HEAD
      flex: 1,
=======
      minWidth: 120, // Ensure all headers have a minimum width
>>>>>>> 1221bf62c1cfda97d86e441b33f4f17fb2c3f03a
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#ffffff',
      padding: 5,
<<<<<<< HEAD
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
=======
    },
    cell: {
      minWidth: 120, // Ensure all cells have a minimum width
      fontSize: 14,
      textAlign: 'center',
      padding: 5,
>>>>>>> 1221bf62c1cfda97d86e441b33f4f17fb2c3f03a
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