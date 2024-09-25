
import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { initializeApp, getApps } from 'firebase/app';
import firebaseConfig from './firebaseConfig'; // Import your Firebase config

// Initialize Firebase
if (getApps().length === 0) {
  initializeApp(firebaseConfig);
}

const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSignup = async () => {
    const auth = getAuth();
    const firestore = getFirestore();
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await setDoc(doc(firestore, 'users', user.uid), {
        name: name,
        email: email,
      });

      Alert.alert('Success', 'User registered successfully!');
      navigation.navigate('Workers');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };
  const signupBackground = require('./assets/back.png'); // Adjust the path as needed

  return (
    <ImageBackground
      source={signupBackground}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Sign Up</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: 'center', // Center items vertically
    alignItems: 'center', // Center items horizontally
  },
  container: {
    width: '90%', // Adjust as needed
    maxWidth: 400, // Maximum width for large screens
    padding: 20, // Add padding if needed
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Slightly transparent for readability
    borderRadius: 10, // Rounded corners
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#AD957E', // A soft, earthy brown
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#D9CAB3', // A softer border color
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 10, // Rounded borders
    backgroundColor: '#FFFAF0', // Very light beige background for input
    color: '#5C5346', // Darker text color for better readability
  },
  button: {
    backgroundColor: '#AD957E',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFF8E1',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SignupScreen;