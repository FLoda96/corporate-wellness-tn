import React, {useState, useContext} from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import {RegisterPageProps} from '../Utils/NavigationTypes'
import {UserContext, UserContextType, LoginContext, LoginContextType} from '../Utils/AuthContext'

export function RegisterPage({ navigation }: RegisterPageProps): JSX.Element {
  const [name, setName] = useState('test-name');
  const {User, SetUser} = useContext(UserContext) as UserContextType;
  const {IsAuthenticated, SetIsAuthenticated} = useContext(LoginContext) as LoginContextType;

  function handleRegister () {
    // TO DO : Add actual Register logic here
    SetUser(name);
    SetIsAuthenticated(true);
  };
  // TO DO : Add confirm password field and related label
  return (
    <View>
      <Text style={styles.label}>Name:</Text>
      <TextInput style={styles.input} value={name} onChangeText={(text) => setName(text)} />
      <TextInput style={styles.input} placeholder="Username" placeholderTextColor="grey" />
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor="grey" secureTextEntry />
      {/* Add more registration fields as needed */}
      <Button title="Register" onPress={() => handleRegister()} />
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
    label: {
      color: 'black', // Set label color to black
      marginBottom: 5,
    },
  });

export default RegisterPage;
