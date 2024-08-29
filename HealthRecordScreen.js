import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Button, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const HealthRecordScreen = ({ navigation }) => {
    const [healthStatus, setHealthStatus] = useState('');
    const [lastCheckup, setLastCheckup] = useState(new Date());
    const [treatmentGiven, setTreatmentGiven] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || lastCheckup;
        setShowDatePicker(Platform.OS === 'ios');
        setLastCheckup(currentDate);
    };

    const handleSave = () => {
        // Logic to save the health record to a database or state management
        alert('Health record saved!');
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Health Status:</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter health status"
                value={healthStatus}
                onChangeText={setHealthStatus}
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