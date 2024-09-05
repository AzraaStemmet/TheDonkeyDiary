// screens/LoginScreen.js
import React, { useState } from 'react';
import { StatusBar, StyleSheet, SafeAreaView, TextInput, Button, ImageBackground, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('testing@gmail.com');
  const [password, setPassword] = useState('123456');

  const handleLogin = async () => {
    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate('Workers'); // Adjust based on your navigation
    } catch (error) {
      console.error(error);
      Alert.alert('Login failed', 'Please check your credentials.');
    }
  };

  const loginBackground = require('./assets/back.png');

  return (
    <ImageBackground
      source={loginBackground}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Button title="Login" onPress={handleLogin} color="#AD957E" />
      </KeyboardAvoidingView>
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
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    width: '100%', // Full width of the container
  },
});

export default LoginScreen;
