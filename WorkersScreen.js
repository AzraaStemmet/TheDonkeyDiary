// screens/WorkersScreen.js
import React from 'react';
import { StyleSheet, View, Button } from 'react-native';

const WorkersScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Button title="Register Donkey" onPress={() => navigation.navigate('RegisterDonkey')} />
      <Button title="Search by ID" onPress={() => navigation.navigate('SearchDonkey')} />
      <Button title="View Existing Donkeys" onPress={() => navigation.navigate('ViewReports')} />
        
    </View>
  );
};

export default WorkersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5dc',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
