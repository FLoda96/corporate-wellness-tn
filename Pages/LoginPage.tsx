import React, {useContext, useState} from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import {LoginPageProps} from '../Utils/NavigationTypes'
import {UserContext, UserContextType, LoginContext, LoginContextType} from '../Utils/AuthContext'
import CheckBox from '@react-native-community/checkbox';
import EncryptedStorage from 'react-native-encrypted-storage';
import {saveUserSession, removeUserSession} from '../Utils/EncryptedStorageUtility'

export function LoginPage({ navigation }: LoginPageProps): JSX.Element {
  const [toggleRememberData, setToggleRememberData] = useState(false)
  const [name, setName] = useState('test-name');
  const {User, SetUser} = useContext(UserContext) as UserContextType;
  const {IsAuthenticated, SetIsAuthenticated} = useContext(LoginContext) as LoginContextType;
  const sessionAuthName = 'user_auth'

  // TO DO : Add function to recover password
  // TO DO : Add function to delete user
  async function handleLogin () {
    // TO DO : Add actual login logic here
    if (toggleRememberData) {
      await removeUserSession(sessionAuthName);
      saveUserSession(sessionAuthName, {user : User, username : name, password : "password"})
    }

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
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <CheckBox
          disabled={false}
          value={toggleRememberData}
          tintColors={{ true: '#17202a', false: 'black' }}
          onValueChange={(newValue) => setToggleRememberData(newValue)}
        />
        <Text style={{ color: 'black', marginLeft: 8 }}>Remember credentials</Text>
      </View>
      <Button title="Remove saved credentials" onPress={() => removeUserSession(sessionAuthName)} />
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

export default LoginPage;
