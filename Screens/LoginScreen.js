import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, ImageBackground, Alert, TouchableOpacity } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const auth = getAuth();
    
    // Check for internet connection
    const netInfo = await NetInfo.fetch();
    
    if (netInfo.isConnected) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        // Save credentials locally after successful login
        await AsyncStorage.setItem('userCredentials', JSON.stringify({ email, password }));
        navigation.navigate('Home'); // Adjust based on your navigation
      } catch (error) {
        console.error(error);
        Alert.alert('Login failed', 'Please check your credentials.');
      }
    } else {
      // Offline login logic
      const storedCredentials = await AsyncStorage.getItem('userCredentials');
      if (storedCredentials) {
        const { email: storedEmail, password: storedPassword } = JSON.parse(storedCredentials);
        if (email === storedEmail && password === storedPassword) {
          navigation.navigate('Home');
        } else {
          Alert.alert('Login failed', 'Invalid email or password.');
        }
      } else {
        Alert.alert('Login failed', 'No stored credentials found. Please connect to the internet to log in.');
      }
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    maxWidth: 400,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
  },
  input: {
    height: 50,
    borderColor: '#D9CAB3',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: '#FFFAF0',
    color: '#5C5346',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#AD957E',
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
