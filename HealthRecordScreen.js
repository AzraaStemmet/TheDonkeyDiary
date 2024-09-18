import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Button, Platform, Alert, ScrollView, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { app } from './firebaseConfig';
import { useRoute, useNavigation } from '@react-navigation/native';

const HealthRecordScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();

    const handleSignOut = async () => {
        try {
          await signOut(auth);
          navigation.navigate('Home'); // Navigate to Home or Login screen after sign out
        } catch (error) {
          Alert.alert('Sign Out Error', 'Unable to sign out. Please try again later.');
        }
      };
    


    const [healthStatus, setHealthStatus] = useState('');
    const [symptoms, setSymptoms] = useState('');
    const [medication, setMedication] = useState('');
    const [medicationDate, setMedicationDate] = useState(new Date());
    const [treatmentGiven, setTreatmentGiven] = useState('');
    const [showMedicationDatePicker, setShowMedicationDatePicker] = useState(false);
    const [lastCheckup, setLastCheckup] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || lastCheckup;
        setShowDatePicker(Platform.OS === 'ios');
        setLastCheckup(currentDate);
    };

    const onMedicationDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || medicationDate;
        setShowMedicationDatePicker(Platform.OS === 'ios');
        setMedicationDate(currentDate);
    };

    const handleSave = async () => {
        if (!healthStatus || !treatmentGiven) {
            Alert.alert('Validation Error', 'Please select health status and enter treatment details.');
            return;
        }

        const db = getFirestore(app);
        try {
            await addDoc(collection(db, 'healthRecords'), {
                healthStatus,
                symptoms,
                medication,
                medicationDate,
                lastCheckup,
                treatmentGiven,
            });

            Alert.alert('Success', 'Health record saved successfully!');
            navigation.goBack();
        } catch (e) {
            console.error('Error adding document: ', e);
            Alert.alert('Error', 'Failed to save health record. Please try again.');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.label}>Health Status:</Text>
            <RNPickerSelect
                onValueChange={(value) => setHealthStatus(value)}
                items={[
                    { label: 'Good', value: 'good' },
                    { label: 'Weak', value: 'weak' },
                    { label: 'Critical', value: 'critical' },
                ]}
                style={pickerSelectStyles}
                value={healthStatus}
            />

            <Text style={styles.label}>Symptoms:</Text>
            <RNPickerSelect
                onValueChange={(value) => setSymptoms(value)}
                items={[
                    { label: 'Chafe marks (from tack)', value: 'Chafe marks (from tack)' },
                    { label: 'Lying down/ not able to stand', value: 'Lying down/ not able to stand' },
                    { label: 'Wound', value: 'Wound' },
                    { label: 'Loss of Appetite', value: 'loss_of_appetite' },
                    { label: 'Skin infection', value: 'Skin infection'},
                    { label: 'Lame', value: 'Lame'},
                    { label: 'Misformed hoof', value: 'Misformed hoof'},
                    { label: 'Infected eye', value: 'Infected eye'},
                    { label: 'Diarrhoea', value: 'Diarrhoea'},
                    { label: 'Runny nose', value: 'Runny nose'},
                    { label: 'Coughing', value: 'Coughing'},
                ]}
                style={pickerSelectStyles}
                value={symptoms}
            />

            <Text style={styles.label}>Medication:</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter medication name"
                value={medication}
                onChangeText={setMedication}
            />

            <Text style={styles.label}>Date Medication Administered:</Text>
            <Button title="Select Date" onPress={() => setShowMedicationDatePicker(true)} />
            {showMedicationDatePicker && (
                <DateTimePicker
                    value={medicationDate}
                    mode="date"
                    display="default"
                    onChange={onMedicationDateChange}
                />
            )}

            <Text style={styles.label}>Last Check-Up Date:</Text>
            <Button title="Select Date" onPress={() => setShowDatePicker(true)} />
            {showDatePicker && (
                <DateTimePicker
                    value={lastCheckup}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                />
            )}

            <Text style={styles.label}>Treatment Given:</Text>
            <TextInput
                style={styles.textArea}
                placeholder="Describe the treatment"
                value={treatmentGiven}
                onChangeText={setTreatmentGiven}
                multiline
                numberOfLines={4}
            />

<TouchableOpacity style={styles.customButton} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Record</Text>
        </TouchableOpacity>

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5dc',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#AD957E',
    },
    input: {
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#AD957E',
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    textArea: {
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#AD957E',
        padding: 10,
        marginBottom: 10,
        height: 100,
        backgroundColor: '#fff',
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
      customButton: {
        backgroundColor: '#AD957E',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 10,
      },
      buttonText: {
        color: '#FFF',
        fontSize: 16,
        textAlign: 'center',
      },

});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#AD957E',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30,
        backgroundColor: '#fff',
        marginBottom: 10,
    },
    inputAndroid: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#AD957E',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30,
        backgroundColor: '#fff',
        marginBottom: 10,
    },
});

export default HealthRecordScreen;