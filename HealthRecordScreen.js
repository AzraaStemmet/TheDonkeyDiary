import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Button, Platform, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { app } from './firebaseConfig'; // Update the path if necessary
import { useRoute, useNavigation } from '@react-navigation/native';

const HealthRecordScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();

    const { id, name, gender, age, location, owner, health, image } = route.params;

    const [healthStatus, setHealthStatus] = useState('');
    const [lastCheckup, setLastCheckup] = useState(new Date());
    const [treatmentGiven, setTreatmentGiven] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || lastCheckup;
        setShowDatePicker(Platform.OS === 'ios');
        setLastCheckup(currentDate);
    };

    const handleSave = async () => {
        if (!healthStatus || !treatmentGiven) {
            Alert.alert('Validation Error', 'Please select health status and enter treatment details.');
            return;
        }
    
        const db = getFirestore(app);
        try {
            let imageUrl = '';
            if (image) {
                imageUrl = await uploadImage(image);
            }
    
            // Register donkey after adding health record
            await addDoc(collection(db, 'donkeys'), {
                id,
                name,
                gender,
                age,
                location,
                owner,
                health: healthStatus,
                imageUrl,
            });
    
            // Save health record (optional: to a separate collection if needed)
            await addDoc(collection(db, 'healthRecords'), {
                donkeyId: id,
                healthStatus,
                lastCheckup,
                treatmentGiven,
            });
    
            Alert.alert('Success', 'Donkey and health record saved successfully!');
    
            // Navigate to RegistrationConfirmationScreen and pass the treatmentGiven
            navigation.navigate('RegistrationConfirmationScreen', {
                donkey: {
                    id,
                    name,
                    gender,
                    age,
                    location,
                    owner,
                    health: healthStatus,
                    treatmentGiven, // Add this line
                }
            });
    
        } catch (e) {
            console.error('Error adding document: ', e);
            Alert.alert('Error', 'Failed to save health record. Please try again.');
        }
    };
    

    return (
        <View style={styles.container}>
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
                style={styles.input}
                placeholder="Describe the treatment"
                value={treatmentGiven}
                onChangeText={setTreatmentGiven}
            />

            <Button
                title="Save Record"
                onPress={handleSave}
            />
        </View>
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
