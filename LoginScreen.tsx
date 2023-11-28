import React, {useContext, useState} from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import {LoginScreenProps} from './NavigationTypes'
import {UserContext, UserContextType, LoginContext, LoginContextType} from './AuthContext'

export function LoginScreen({ navigation }: LoginScreenProps): JSX.Element {
  const [name, setName] = useState('test-name');
  const {User, SetUser} = useContext(UserContext) as UserContextType;
  const {IsAuthenticated, SetIsAuthenticated} = useContext(LoginContext) as LoginContextType;

  
  function handleLogin () {
    // TO DO : Add actual login logic here
    SetUser(name);
    SetIsAuthenticated(true);
  };


  return (
    <View>
      <Text style={styles.label}>Name:</Text>
      <TextInput style={styles.input} value={name} onChangeText={(text) => setName(text)} />
      <TextInput style={styles.input} placeholder="Username" placeholderTextColor="grey" />
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor="grey" secureTextEntry />
      <Button title="Login" onPress={() => handleLogin()} />
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
    label: {
      color: 'black', // Set label color to black
      marginBottom: 5,
    },
  });

export default LoginScreen;
