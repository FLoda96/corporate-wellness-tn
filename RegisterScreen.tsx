import React from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import {RegisterScreenProps} from './NavigationTypes'

export function RegisterScreen({ navigation }: RegisterScreenProps): JSX.Element {

  const handleRegister = () => {
    // Add register logic here
    // If registration is successful, navigate to the main screen
    // Currently commented cuz i have no idea of how to make it beahave
    // navigation.navigate('MainPage');
  };

  return (
    <View>
      <TextInput style={styles.input} placeholder="Username" placeholderTextColor="grey" />
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor="grey" secureTextEntry />
      {/* Add more registration fields as needed */}
      <Button title="Register" onPress={handleRegister} />
      <Button title="Already Registered ?" onPress={() => navigation.navigate('Login')} />

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

export default RegisterScreen;
