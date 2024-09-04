// screens/LoginScreen.js
import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Button, ImageBackground, KeyboardAvoidingView, Platform } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('testing@gmail.com');
  const [password, setPassword] = useState('123456');

  const handleLogin = async () => {
    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate('Workers');
    } catch (error) {
      console.error(error);
      alert('Login failed. Please check your credentials.');
    }
  };

  const loginBackground = require('./assets/donkeys.jpg');

  return (
    <ImageBackground
      source={loginBackground}
      style={styles.loginBackground}
      resizeMode="cover" // Ensure the image covers the background properly
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.innerContainer}>
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
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  loginBackground: {
    flex: 1, // Ensures the ImageBackground covers the whole screen
    justifyContent: 'center', // Centers the content vertically
    alignItems: 'center', // Centers the content horizontally
  },
  container: {
    flex: 1, // Takes up the full space of the ImageBackground
    justifyContent: 'center', // Centers content vertically within container
    alignItems: 'center', // Centers content horizontally within container
  },
  innerContainer: {
    width: '90%', // Increased width for a larger container
    maxWidth: 400, // Set a maximum width for large screens
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Slightly transparent to improve readability
    borderRadius: 10,
    alignItems: 'center', // Center items within inner container
  },
  input: {
    height: 50, // Consistent height for both text boxes
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 110, // Consistent padding inside text boxes
    width: '100%', // Ensure text boxes take up full width of container
  },
});
