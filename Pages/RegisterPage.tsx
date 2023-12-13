import React, {useState, useContext} from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import {RegisterPageProps} from '../Utils/NavigationTypes'
import {UserContext, UserContextType, LoginContext, LoginContextType} from '../Utils/AuthContext'
import { validateEmail } from '../Utils/ValidationUtils';
import { serverUrl, RegisterUser, RegisterAuth, created, bad_request, Login } from '../Utils/WebServerUtils';

// TO DO : Loading animation during the login
export function RegisterPage({ navigation }: RegisterPageProps): JSX.Element {
  const [company, setCompany] = useState(1);
  const [username, setUsername] = useState('test-name');
  const [email, setEmail] = useState('test@abc.com');
  const [emailIsWellFormatted, setEmailIsWellFormatted] = useState(true);
  const [emailAlreadyExist, setEmailAlreadyExist] = useState(false);
  const [password, setPassword] = useState('aaaaaa');
  const [repeatPassword, setRepeatPassword] = useState('aaaaaa');
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [passwordsMinLenght, setPasswordsMinLenght] = useState(true);
  const [userId, setUserId] = useState(0);
  const {User, SetUser} = useContext(UserContext) as UserContextType;
  const {IsAuthenticated, SetIsAuthenticated} = useContext(LoginContext) as LoginContextType;

  async function handleRegister () {
    if (!validateEmail({email})) {
      setEmailIsWellFormatted(false);
      return;
    } else {
      setEmailIsWellFormatted(true);
    }
    if (password.length < 6) {
      setPasswordsMinLenght(false);
      return;
    } else {
      setPasswordsMinLenght(true);
    }
    if (password !== repeatPassword) {
      setPasswordsMatch(false);
      return;
    }
    
    const RegisterUserResponse = await RegisterUser({company, email, username});
    if (RegisterUserResponse.response_code == created) {
      const user_id = RegisterUserResponse.user_id;
      const RegisterAuthResponse = await RegisterAuth({user_id, email, password });
      if (RegisterAuthResponse == created) {
        const LoginResponse = await Login ({email, password});
        if (LoginResponse == created) {
          SetUser(username);
          SetIsAuthenticated(true);
        } else {
          console.log("Something went wrong")
        }
      } else {
        console.log("Something went wrong")
      }

    } else if (RegisterUserResponse.response_code == bad_request) {
      setEmailAlreadyExist(true);
      return;
    }
  };
  // TO DO : Add confirm password field and related label
  return (
    <View>
      <Text style={styles.label}>Username:</Text>
      <TextInput style={styles.input} placeholder="Username" placeholderTextColor="grey" value={username} onChangeText={(text) => setUsername(text)} />
      <Text style={styles.label}>Email:</Text>
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor="grey" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={(text) => setEmail(text)} />
      {emailAlreadyExist && (<Text style={styles.warningText}>This email is already in use</Text>)}
      {!emailIsWellFormatted && (<Text style={styles.warningText}>This is not a valid email</Text>)}
      <Text style={styles.label}>Password:</Text>
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor="grey" secureTextEntry autoCapitalize="none" value={password} onChangeText={(text) => setPassword(text)} />
      <TextInput style={styles.input} placeholder="Repeat Password" placeholderTextColor="grey" secureTextEntry autoCapitalize="none" value={repeatPassword} onChangeText={(text) => setRepeatPassword(text)} />
      {!passwordsMinLenght && (<Text style={styles.warningText}>The password must be at least 6 characters long</Text>)}
      {!passwordsMatch && (<Text style={styles.warningText}>Passwords do not match!</Text>)}
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
    warningText: {
      color: 'red',
      marginVertical: 5,
    },
  });

export default RegisterPage;
