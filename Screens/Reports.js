import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, pickerSelectStyles, TouchableOpacity, Alert } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useNavigation, useRoute } from '@react-navigation/native';
import { printToFileAsync } from 'expo-print';
import { shareAsync } from 'expo-sharing'; // importing dependencies for functionaltities of the applciation 


const DonkeyReport = () => {
  const navigation = useNavigation();
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Welcome'); // naviagte to home screen after sign o ut
    } catch (error) {
      Alert.alert('Sign Out Error', 'Unable to sign out. Please try again later.');
    }
  };
  const [donkeys, setDonkeys] = useState([]);
  const [filteredDonkeys, setFilteredDonkeys] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGender, setFilterGender] = useState('');
  const [filterAge, setFilterAge] = useState('');
  const [filterHealthStatus, setFilterHealthStatus] = useState('');
  // initializing state variables 

  useEffect(() => {
    const fetchDonkeys = async () => {
      const querySnapshot = await getDocs(collection(db, "donkeys"));
      const donkeyList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDonkeys(donkeyList);
      setFilteredDonkeys(donkeyList);
    };
    fetchDonkeys();
  }, []); // fetches donkey data from firestore database and the whole donkey list, and filtered donkey list 

  useEffect(() => {
    filterDonkeys();
  }, [searchQuery, donkeys, filterGender, filterAge]);

  const filterDonkeys = () => {
    let filtered = donkeys.filter(donkey => {
      return (
        (donkey.name && donkey.name.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (filterGender ? donkey.gender && donkey.gender.toLowerCase() === filterGender.toLowerCase() : true) &&
        (filterAge ? checkAgeRange(donkey.age, filterAge) : true) &&
        (filterHealthStatus ? donkey.health && donkey.health.toLowerCase() === filterHealthStatus.toLowerCase() : true)
      );
    });
    setFilteredDonkeys(filtered);
  };
  

  const checkAgeRange = (age, range) => {
    switch (range) {
      case '< 12 months': return age === '< 12 months';
      case '1-5yrs': return age === '1-5yrs';
      case '6-10yrs': return age === '6-10yrs';
      case 'older than 10yrs': return age === 'older than 10yrs';
      case 'unknown': return age === 'unknown';
      default: return true; // Show all ages if no filter is selected
    }
  };
  const generateTable = (filteredDonkeys, filterGender, filterAge, filterHealthStatus) => {
    const heading = `
      <h2 style="color: #AD957E;">Donkey Report</h2>
      <p>Filters Applied: 
        ${filterGender ? `Gender: ${filterGender}, ` : ''}
        ${filterAge ? `Age: ${filterAge}, ` : ''}
        ${filterHealthStatus ? `Health Status: ${filterHealthStatus}` : ''}
      </p>
    `;
  
    return `
     <html>
       <head>
         <style>
           body {
             font-family: Arial, sans-serif;
           }
           table {
             width: 100%;
             border-collapse: collapse;
           }
           table, th, td {
             border: 1px solid #cccccc;
           }
           th {
             background-color: #AD957E; /* Match your app's menu strip color */
             color: white;
             padding: 10px;
             text-align: center;
           }
           td {
             padding: 10px;
             text-align: center;
           }
           tr:nth-child(even) {
             background-color: #f5f5dc; /* Light background for alternate rows */
           }
           tr:nth-child(odd) {
             background-color: #ffffff; /* White background for alternate rows */
           }
           h2 {
             text-align: center;
             font-size: 24px;
           }
           p {
             font-size: 16px;
             text-align: center;
             color: #333;
             margin-bottom: 20px;
           }
         </style>
       </head>
       <body>
         ${heading}
         <table>
           <thead>
             <tr>
               <th>ID</th>
               <th>Name</th>
               <th>Age</th>
               <th>Gender</th>
               <th>Health Status</th>
               <th>Location</th>
             </tr>
           </thead>
           <tbody>
             ${filteredDonkeys.map(donkey => `
               <tr>
                 <td>${donkey.id}</td>
                 <td>${donkey.name}</td>
                 <td>${donkey.age}</td>
                 <td>${donkey.gender}</td>
                 <td>${donkey.health}</td>
                 <td>${donkey.location}</td>
               </tr>
             `).join('')}
           </tbody>
         </table>
       </body>
     </html>
   `;
  };
  
  let generatePDF = async () => {
    const htmlContent = generateTable(filteredDonkeys, filterGender, filterAge, filterHealthStatus); // Pass the filters
    const file = await printToFileAsync({
      html: htmlContent,
      base64: false,
    });
    await shareAsync(file.uri);
  };

  return (
    <ScrollView style={styles.scrollView}>
        <View style={styles.menuStrip}>
          <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Register Donkey')}>
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
    <ScrollView style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by ID"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between',alignItems: 'center',marginTop:20, marginBottom: 30 }}>
      <View style={{ flex: 1, marginRight: 5 }}>
      <RNPickerSelect
        onValueChange={(value) => setFilterGender(value)}
        items={[
          { label: 'Male', value: 'male' },
          { label: 'Female', value: 'female' },
          { label: 'All', value: '' },
        ]}
        style={pickerSelectStyles}
        placeholder={{ label: "Filter by Gender", value: '' }}
      />
      </View>
      <View style={{ flex: 1, marginHoriztontal: 5}}>
      <RNPickerSelect
        onValueChange={(value) => setFilterAge(value)}
        items={[
          { label: 'Under 12 months', value: '< 12 months' },
          { label: '1-5 years', value: '1-5yrs' },
          { label: '6-10 years', value: '6-10yrs' },
          { label: 'Older than 10 years', value: 'older than 10yrs' },
          { label: 'Unknown', value: 'unknown' },
          { label: 'All Ages', value: '' },
        ]}
        style={pickerSelectStyles}
        placeholder={{ label: "Filter by Age", value: null }}
      />
      </View>
      
      <View style={{ flex: 1, marginLeft: 1}}>
      <RNPickerSelect
      onValueChange={(value) => setFilterHealthStatus(value)}
      items={[
        {label: 'Good', value: 'Good'},
        {label: 'Mild', value: 'Mild'},
        {label: 'Serious', value: 'Serious'},
      ]}
      style={pickerSelectStyles}
      placeholder={{ label: "Filter by Health St", value: null}}
      />
      </View>
    </View>
      <ScrollView horizontal={true}>
        <View style={styles.table}>
          <ScrollView horizontal={true}>
            <View style={styles.headerRow}>
              <Text style={styles.header}>Donkey Name</Text>
              <Text style={styles.header}>Age</Text>
              <Text style={styles.header}>Gender</Text>
              <Text style={styles.header}>Health Status</Text>
              <Text style={styles.headerLocation}>Location</Text>
              <Text style={styles.header}>Owner</Text>
              <Text style={styles.headerID}>ID</Text>
            </View>
          </ScrollView>
          {filteredDonkeys.map((donkey) => (
            <ScrollView horizontal={true} key={donkey.id} style={styles.row}>
              <Text style={styles.cell}>{donkey.name}</Text>
              <Text style={styles.cell}>{donkey.age}</Text>
              <Text style={styles.cell}>{donkey.gender}</Text>
              <Text style={styles.cell}>{donkey.health}</Text>
              <Text style={styles.cellLocation}>
                {typeof donkey.location === 'object'
                ? '${donkey.location.latitude, ${donkey.location.longtitude}'
                : donkey.location}

              </Text>
              <Text style={styles.cell}>{donkey.owner}</Text>
              <Text style={styles.cell}>{donkey.id}</Text>
            </ScrollView>
          ))}
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.customButton} onPress={generatePDF}>
          <Text style={styles.buttonTextCust}>Export as PDF</Text>
        </TouchableOpacity>
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
      borderColor: '#AD957E',
      borderWidth: 1,
      marginBottom: 20,
      paddingHorizontal: 10,
      backgroundColor: '#fff',
      borderRadius: 6,
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
      borderRadius: 10,

    },
    row: {
      flexDirection: 'row',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#cccccc',
      borderRadius: 10,
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
    headerLocation: {
      minWidth: 300, // Ensure all headers have a minimum width
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#ffffff',
      padding: 5,

    },
    cellLocation:{
      flex: 1,
      fontSize: 14,
      textAlign: 'center',
      padding: 5,
      minWidth: 300,

    },
    headerID:{
      minWidth: 300, // Ensure all headers have a minimum width
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#ffffff',
      padding: 5,

    },
    cellID:{
    flex: 1,
      fontSize: 14,
      textAlign: 'center',
      padding: 5,
      minWidth: 300,

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