import React, {useContext, useState} from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import {LoginPageProps} from '../Utils/NavigationTypes'
import {UserContext, UserContextType, LoginContext, LoginContextType} from '../Utils/AuthContext'
import CheckBox from '@react-native-community/checkbox';
import { HandleLogin } from '../Utils/FunctionUtils';


export function LoginPage({ navigation }: LoginPageProps): JSX.Element {
  const [toggleRememberData, setToggleRememberData] = useState(false)
  const [email, setEmail] = useState('test@abc.com');
  const [password, setPassword] = useState('aaaaaa');
  const [name, setName] = useState('test-name');
  const {User, SetUser} = useContext(UserContext) as UserContextType;
  const {IsAuthenticated, SetIsAuthenticated} = useContext(LoginContext) as LoginContextType;
//  const sessionAuthName = 'user_auth'

  // TO DO : Add function to recover password
  // TO DO : Add function to delete user


  return (
    <View>
      <Text style={styles.label}>Email:</Text>
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor="grey" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={(text) => setEmail(text)} />
      <Text style={styles.label}>Password:</Text>
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor="grey" secureTextEntry autoCapitalize="none" value={password} onChangeText={(text) => setPassword(text)} />
      <Button title="Login" onPress={() => HandleLogin({email : email, password : password, toggleRememberData : toggleRememberData, setUser : SetUser, setIsAuthenticated : SetIsAuthenticated})} />
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <CheckBox
          disabled={false}
          value={toggleRememberData}
          tintColors={{ true: '#17202a', false: 'black' }}
          onValueChange={(newValue) => setToggleRememberData(newValue)}
        />
        <Text style={{ color: 'black', marginLeft: 8 }}>Remember me</Text>
      </View>
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
