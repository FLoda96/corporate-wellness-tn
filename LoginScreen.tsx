import React from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import {LoginScreenProps} from './NavigationTypes'

export function LoginScreen({ navigation }: LoginScreenProps): JSX.Element {
  
  const handleLogin = () => {
    // Add login logic here
    // If login is successful, navigate to the main screen
    // Currently commented cuz i have no idea of how to make it beahave
    // navigation.navigate('MainPage');
  };


  return (
    <View>
      <TextInput style={styles.input} placeholder="Username" placeholderTextColor="grey" />
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor="grey" secureTextEntry />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Need to Register Instead ?" onPress={() => navigation.navigate('Register')} />
    </View>
  );
};

const styles = StyleSheet.create({
    input: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 10,
      paddingHorizontal: 10,
      color: 'black', // Set text color to black
    },
  });

export default LoginScreen;
