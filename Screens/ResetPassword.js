import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, ImageBackground, Alert, TouchableOpacity } from 'react-native';
import { getAuth } from 'firebase/auth';

const ResetPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handleResetPassword = async () => {
    const auth = getAuth();
    try {
      await auth.sendPasswordResetEmail(email);
      Alert.alert('Success', 'Reset link sent to your email.');
      navigation.navigate('Login'); 
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to send reset email. Please check your email address.');
    }
  };

  const resetBackground = require('../assets/back.png'); 

  return (
    <ImageBackground
      source={resetBackground}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Reset Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#8A7E72"
          value={email}
          onChangeText={setEmail}
        />
        <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
          <Text style={styles.buttonText}>Send Reset Link</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.linkText}>Back to Login</Text>
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
  linkText: {
    marginTop: 10,
    color: '#AD957E', 
    textAlign: 'center',
  },
});

export default ResetPasswordScreen;

