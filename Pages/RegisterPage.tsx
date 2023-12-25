import React, {useState, useContext} from 'react';
import { View, TextInput, Button, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import {RegisterPageProps} from '../Utils/NavigationTypes'
import {UserContext, UserContextType, LoginContext, LoginContextType, UserIdContext, UserIdContextType} from '../Utils/AuthContext'
import { validateEmail } from '../Utils/ValidationUtils';
import { serverUrl, RegisterUser, RegisterAuth, created, bad_request, Login } from '../Utils/WebServerUtils';
import { HandleLogin } from '../Utils/FunctionUtils';
import CheckBox from '@react-native-community/checkbox';
import { LoadingScreen } from '../Utils/LoadingScreen';
import { styles } from '../Utils/Styles';
import { WebServerUp } from '../Utils/WebServerUp';
import { useTranslation } from 'react-i18next';
import { LanguagePicker } from '../Languages/LanguagePicker'


// TO DO : Loading animation during the login
export function RegisterPage({ navigation }: RegisterPageProps): JSX.Element {
  const [company, setCompany] = useState(1);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('test@abc.com');
  const [emailIsWellFormatted, setEmailIsWellFormatted] = useState(true);
  const [emailAlreadyExist, setEmailAlreadyExist] = useState(false);
  const [registrationIsFailed, setRegistrationIsFailed] = useState(false);
  const [password, setPassword] = useState('aaaaaa');
  const [repeatPassword, setRepeatPassword] = useState('aaaaaa');
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [passwordsMinLenght, setPasswordsMinLenght] = useState(true);
  const [userId, setUserId] = useState(0);
  const [toggleRememberData, setToggleRememberData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { t, i18n } = useTranslation();
  const {User, SetUser} = useContext(UserContext) as UserContextType;
  const {UserId, SetUserId} = useContext(UserIdContext) as UserIdContextType;
  const {IsAuthenticated, SetIsAuthenticated} = useContext(LoginContext) as LoginContextType;

  async function handleRegister () {
    setIsLoading(true);

    if (!validateEmail({email})) {
      setEmailIsWellFormatted(false);
      setIsLoading(false);
      return;
    } else {
      setEmailIsWellFormatted(true);
    }
    if (password.length < 6) {
      setPasswordsMinLenght(false);
      setIsLoading(false);
      return;
    } else {
      setPasswordsMinLenght(true);
    }
    if (password !== repeatPassword) {
      setPasswordsMatch(false);
      setIsLoading(false);
      return;
    }
    
    const RegisterUserResponse = await RegisterUser({company, email, username});
    if (RegisterUserResponse.response_code == created) {
      const user_id = RegisterUserResponse.user_id;
      const RegisterAuthResponse = await RegisterAuth({user_id, email, password });
      if (RegisterAuthResponse == created) {
        HandleLogin({email : email, password : password, toggleRememberData : toggleRememberData, setUser : SetUser, setUserId: SetUserId, setIsAuthenticated : SetIsAuthenticated});
      } else {
        console.log("Something went wrong")
        setRegistrationIsFailed(true);
        setIsLoading(false);
      }

    } else if (RegisterUserResponse.response_code == bad_request) {
      setEmailAlreadyExist(true);
      setRegistrationIsFailed(false);
      setIsLoading(false);
      return;
    }

  };
  
  // TO DO : Add confirm password field and related label
  return (
    <View style={styles.backgroundColor}>
      <View style={styles.center}><Image style={styles.image} source={require('../Images/MoveApp_Transparent_Background.png')}/></View>
      <Text style={styles.label}>Email:</Text>
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor="grey" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={(text) => setEmail(text)} />
      {emailAlreadyExist && (<Text style={styles.warningText}>This email is already in use</Text>)}
      {!emailIsWellFormatted && (<Text style={styles.warningText}>This is not a valid email</Text>)}
      <Text style={styles.label}>Password:</Text>
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor="grey" secureTextEntry autoCapitalize="none" value={password} onChangeText={(text) => setPassword(text)} />
      <Text style={styles.label}>Repeat Password:</Text>
      <TextInput style={styles.input} placeholder="Repeat Password" placeholderTextColor="grey" secureTextEntry autoCapitalize="none" value={repeatPassword} onChangeText={(text) => setRepeatPassword(text)} />
      {!passwordsMinLenght && (<Text style={styles.warningText}>The password must be at least 6 characters long</Text>)}
      {!passwordsMatch && (<Text style={styles.warningText}>Passwords do not match!</Text>)}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <CheckBox
          disabled={false}
          value={toggleRememberData}
          tintColors={{ true: '#17202a', false: 'black' }}
          onValueChange={(newValue) => setToggleRememberData(newValue)}
        />
        <Text style={{ color: 'black', marginLeft: 8 }}>Remember me</Text>
      </View>
      <Button title={t('register')} onPress={() => handleRegister()} />
      {registrationIsFailed && (<Text style={styles.warningText}>Registration Failed</Text>)}
      <View style={{marginBottom: 10}}></View>
      <Button title="Already Registered ?" onPress={() => navigation.navigate('Login')} />
      <LanguagePicker/>
      {isLoading && <LoadingScreen/>}
      <WebServerUp/>
    </View>
  );
};

export default RegisterPage;
