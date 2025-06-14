import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Layout from './navigation/_layout';
import Login from './auth/login';
import Register from './auth/register';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

function Awal() {
  const [isLogged, setIsLogged] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('token');
      setTimeout(() => {
        if (token) {
          navigation.replace('_layout');
        } else {
          navigation.replace('login');
        }
        setLoading(false);
      }, 3000);
    };
    checkLoginStatus();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Image source={require('../assets/images/scidac.png')} style={styles.image} />
        <Text style={styles.heading}>SIDAC</Text>
        <Text style={styles.body}>Study Islamic and Daily Activity</Text>
      </View>
    );
  }

  return null;
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Stack.Navigator initialRouteName="Awal" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Awal" component={Awal} />
      <Stack.Screen name="_layout" component={Layout} />
      <Stack.Screen name="login" component={Login} />
      <Stack.Screen name="register" component={Register} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', backgroundColor: 'white', justifyContent: 'center' },
  heading: { marginTop: -30, fontSize: 40, fontWeight: 'bold', color: 'orange' },
  body: { fontSize: 18, color: 'slategray' },
  image: { height: 200 },
});
