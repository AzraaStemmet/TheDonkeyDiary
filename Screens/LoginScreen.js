import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, ImageBackground, Alert, TouchableOpacity } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate('Home'); // Adjust based on your navigation
    } catch (error) {
      console.error(error);
      Alert.alert('Login failed', 'Please check your credentials.');
    }
  };

  const loginBackground = require('../assets/back.png');

  return (
    <ImageBackground
      source={loginBackground}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#8A7E72"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#8A7E72"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Reset Password')}>
          <Text style={styles.linkText}>Forgot Password?</Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#AD957E', // A soft, earthy brown
    marginBottom: 20,
    textAlign: 'center',
  },
  linkText: {
    marginTop: 10,
    color: '#AD957E',

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

export default LoginScreen;