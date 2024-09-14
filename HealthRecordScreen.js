import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Button, Platform, Alert, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { app } from './firebaseConfig';
import { useRoute, useNavigation } from '@react-navigation/native';

const HealthRecordScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();



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

            Alert.alert('Success', 'Donkey and health record saved successfully!');

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

            <Button
                title="Save Record"
                onPress={handleSave}
            />
        </ScrollView>
    );
};

export default HealthRecordScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        marginBottom: 10,
    },
    textArea: {
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        marginBottom: 10,
        height: 100,
    },
});

const pickerSelectStyles = StyleSheet.create({
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
});
