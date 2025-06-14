import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/firebaseconfig'; // pastikan path ini benar

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigation = useNavigation();

  const showAlert = (message) => {
    Alert.alert(
      "Login Gagal",
      message,
      [{ text: "OK", onPress: () => console.log("OK ditekan") }],
      { cancelable: false }
    );
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showAlert("Email dan password wajib diisi.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // Simpan ke AsyncStorage (misal uid)
      await AsyncStorage.setItem('userUID', userCredential.user.uid);

      console.log("Login berhasil:", userCredential.user);

      navigation.navigate('_layout'); // sesuaikan dengan navigasi utama kamu

    } catch (error) {
      console.error("Login error:", error);
      let message = "Terjadi kesalahan saat login.";

      if (error.code === 'auth/user-not-found') {
        message = "Email tidak ditemukan.";
      } else if (error.code === 'auth/wrong-password') {
        message = "Password salah.";
      } else if (error.code === 'auth/invalid-email') {
        message = "Email tidak valid.";
      }

      setError(message);
      showAlert(message);
    }
  };

  const handleRegister = () => {
    navigation.navigate('register');
  };

  return (
    <View style={styles.container}>
      <View>
        <Image source={require('../../assets/images/moon.png')} style={{ width: 100, height: 100, marginBottom: -80 }} />
        <Image source={require('../../assets/images/login.png')} style={{ width: 100, height: 100, marginBottom: 60 }} />
      </View>

      <View style={styles.view1}>
        <View style={styles.view2}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Text style={styles.error}>Lupa password?</Text>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleRegister}>
          <Text style={styles.buttonText2}>Belum punya akun? klik di sini</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: "lightblue",
  },
  view1: {
    justifyContent: 'center',
    padding: 70,
    backgroundColor: "white",
    height: "80%",
    width: "110%",
    marginBottom: -140,
    borderRadius: 40,
  },
  view2: {
    marginTop: -110,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'lightblue',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 8,
    borderRadius: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
    marginTop: -10,
    textAlign: 'right',
    fontSize: 12,
  },
  button: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    borderRadius: 10,
  },
  buttonText2: {
    color: 'slategrey',
    borderRadius: 10,
    marginTop: 10,
    marginLeft: 18,
  },
});

export default Login;
