import React, {useContext, useState} from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import {LoginPageProps} from '../Utils/NavigationTypes'
import {UserContext, UserContextType, LoginContext, LoginContextType} from '../Utils/AuthContext'
import CheckBox from '@react-native-community/checkbox';
import { HandleLogin } from '../Utils/FunctionUtils';

  // TO DO : Add function to recover password
  // TO DO : Add function to delete user
  // TO DO : Add warning about non existing account or something
  // TO DO : Implement Lock or something after n login attempt ?
  // TO DO : Implement main util page for styles
export function LoginPage({ navigation }: LoginPageProps): JSX.Element {
  const [toggleRememberData, setToggleRememberData] = useState(false);
  const [loginIsFailed, setLoginIsFailed] = useState(false);

  const [email, setEmail] = useState('test@abc.com');
  const [password, setPassword] = useState('aaaaaa');
  const [name, setName] = useState('test-name');
  const {User, SetUser} = useContext(UserContext) as UserContextType;
  const {IsAuthenticated, SetIsAuthenticated} = useContext(LoginContext) as LoginContextType;

  async function Login () {
    const success = await HandleLogin({email : email, password : password, toggleRememberData : toggleRememberData, setUser : SetUser, setIsAuthenticated : SetIsAuthenticated});
    if (!success) {
      setLoginIsFailed(true);
    }
  }

  return (
    <View>
      <Text style={styles.label}>Email:</Text>
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor="grey" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={(text) => setEmail(text)} />
      <Text style={styles.label}>Password:</Text>
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor="grey" secureTextEntry autoCapitalize="none" value={password} onChangeText={(text) => setPassword(text)} />
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <CheckBox
          disabled={false}
          value={toggleRememberData}
          tintColors={{ true: '#17202a', false: 'black' }}
          onValueChange={(newValue) => setToggleRememberData(newValue)}
        />
        <Text style={{ color: 'black', marginLeft: 8 }}>Remember me</Text>
      </View>
      <Button title="Login" onPress={() => Login()} />
      {loginIsFailed && (<Text style={styles.warningText}>Login Failed</Text>)}
      <View style={{marginBottom: 10}}></View>
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
    warningText: {
      color: 'red',
      marginVertical: 5,
    },
  });

export default LoginPage;
