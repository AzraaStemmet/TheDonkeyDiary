// screens/DonkeyDetails.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const DonkeyDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { id, name, gender, breed, age, location, owner, health, imageUrl } = route.params;

  return (
    <View style={styles.container}>
      <Text>Donkey ID: {id}</Text>
      <Text>Donkey Name: {name}</Text>
      <Text>Donkey Gender: {gender}</Text>
      <Text>Donkey Breed: {breed}</Text>
      <Text>Donkey Age: {age}</Text>
      <Text>Location: {location}</Text>
      <Text>Owner: {owner}</Text>
      <Text>Health Status: {health}</Text>
      {imageUrl ? <Image source={{ uri: imageUrl }} style={{ width: 200, height: 200 }} /> : null}
      
      <Button
        title="Register Another Donkey"
        onPress={() => {
          navigation.navigate('RegisterDonkey', { reset: true });
        }}
      />
      <Button
        title="Return to Workers Page"
        onPress={() => navigation.navigate('WorkersScreen')}
      />
      <Button title="Return to workers page" onPress={() => navigation.navigate('WorkersScreen')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default DonkeyDetails;
