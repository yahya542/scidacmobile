import React, { useState } from 'react';
import {
  View, Text, Image, TextInput, StyleSheet, Alert,
  TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../firebase/firebaseconfig'; // pastikan path ini benar

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigation = useNavigation();

  const handleRegister = async () => {
    if (password !== password2) {
      Alert.alert("Error", "Konfirmasi password tidak cocok.");
      return;
    }
    if (password.length < 8) {
      Alert.alert("Error", "Password harus minimal 8 karakter.");
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: username,
        });
      }

      Alert.alert("Sukses", "Registrasi berhasil, silakan login.");
      navigation.navigate('login');
    } catch (error) {
      console.error("Register error:", error);
      let message = "Terjadi kesalahan.";

      if (error.code === 'auth/email-already-in-use') {
        message = "Email sudah digunakan.";
      } else if (error.code === 'auth/invalid-email') {
        message = "Email tidak valid.";
      } else if (error.code === 'auth/weak-password') {
        message = "Password terlalu lemah.";
      }

      setErrorMessage(message);
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  const masukLogin = () => {
    navigation.navigate('login');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoid}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.view1}>
          {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            value={password2}
            onChangeText={setPassword2}
            secureTextEntry
          />
          <TouchableOpacity
            onPress={handleRegister}
            style={[styles.button, loading && styles.buttonDisabled]}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? 'Loading...' : 'Register'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={masukLogin} style={{ marginTop: 10 }}>
            <Text style={styles.linkText}>Sudah punya akun? Klik di sini</Text>
          </TouchableOpacity>
        </View>
        <Image
          style={styles.image1}
          source={require('../../assets/images/register.png')} // pastikan path ini valid
          resizeMode="contain"
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'orange',
  },
  view1: {
    backgroundColor: 'white',
    width: '100%',
    maxWidth: 400,
    padding: 25,
    borderRadius: 15,
    marginTop: 50,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  input: {
    width: '100%',
    height: 45,
    borderColor: 'orange',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 12,
    borderRadius: 15,
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: 'lightblue',
    width: '100%',
    height: 45,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#a0c4ff',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  linkText: {
    color: 'slategrey',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  image1: {
    height: 180,
    width: 180,
    marginTop: 10,
  },
});
