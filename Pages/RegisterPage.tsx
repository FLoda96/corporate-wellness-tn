import React, {useState, useContext, useEffect} from 'react';
import { View, TextInput, Button, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import {RegisterPageProps} from '../Utils/NavigationTypes'
import {UserContext, UserContextType, LoginContext, LoginContextType, UserIdContext, UserIdContextType} from '../Utils/AuthContext'
import { validateEmail } from '../Utils/ValidationUtils';
import { serverUrl, RegisterUser, RegisterAuth, created, bad_request, Login } from '../Utils/WebServerUtils';
import { HandleLogin, sessionAuthName } from '../Utils/FunctionUtils';
import CheckBox from '@react-native-community/checkbox';
import { LoadingScreen } from '../Utils/LoadingScreen';
import { styles } from '../Utils/Styles';
import { WebServerUp } from '../Utils/WebServerUp';
import { useTranslation } from 'react-i18next';
import { LanguagePicker } from '../Languages/LanguagePicker'
import {retrieveSessionData} from '../Utils/EncryptedStorageUtility'

// TO DO : Check that an email actually exist
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
  const [toggleRememberData, setToggleRememberData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { t, i18n } = useTranslation();
  const {User, SetUser} = useContext(UserContext) as UserContextType;
  const {UserId, SetUserId} = useContext(UserIdContext) as UserIdContextType;
  const {IsAuthenticated, SetIsAuthenticated} = useContext(LoginContext) as LoginContextType;

  const placeholder_email = t('register_page.email_placeholder');
  const placeholder_password = t('register_page.password_placeholder');
  const placeholder_repeat_password = t('register_page.repeat_password_placeholder');
  const email_already_exist_warning = t('register_page.email_already_exist_warning');
  const email_badly_formatted_warning = t('register_page.email_badly_formatted_warning');
  const password_min_lenght_warning = t('register_page.password_min_lenght_warning');
  const passwords_match_warning = t('register_page.passwords_match_warning');
  const remember_me = t('register_page.remember_me');
  const registration_failed = t('register_page.registration_failed');
  const registration_button = t('register_page.register');
  const already_registered = t('register_page.already_registered');

    // TO DO : Is loogin with the remembered credential the right move ? do i want the app to be accessible even offline ?
    useEffect(() => {
      setIsLoading(true);
      const fetchData = async () => {
        try {
          const session = await retrieveSessionData(sessionAuthName);
          if (session !== undefined) {
            const parsedSession = JSON.parse(session);
            if ((parsedSession.email !== null) && (parsedSession.password !== null)) {
              HandleLogin({email : parsedSession.email, password : parsedSession.password, toggleRememberData : toggleRememberData, setUser : SetUser, setUserId : SetUserId, setIsAuthenticated : SetIsAuthenticated})
            }
          } else {
            setIsLoading(false);
          }
        } catch (error) {
          console.error('Error retrieving session: ' + error);
        }
      };
      // Roundabout way to call the above but async TO DO : search a library that does this
      fetchData();
    }, []);

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
  
  return (
    <View style={styles.backgroundColor}>
      <View style={styles.center}><Image style={styles.image} source={require('../Images/MoveApp_Transparent_Background.png')}/></View>
      
      <Text style={styles.label}>{placeholder_email}:</Text>
      <TextInput style={styles.input} placeholder={placeholder_email} placeholderTextColor="grey" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={(text) => setEmail(text)} />
      {emailAlreadyExist && (<Text style={styles.warningText}>{email_already_exist_warning}</Text>)}
      {!emailIsWellFormatted && (<Text style={styles.warningText}>{email_badly_formatted_warning}</Text>)}
      <Text style={styles.label}>{placeholder_password}:</Text>
      <TextInput style={styles.input} placeholder={placeholder_password} placeholderTextColor="grey" secureTextEntry autoCapitalize="none" value={password} onChangeText={(text) => setPassword(text)} />
      <Text style={styles.label}>{placeholder_repeat_password}:</Text>
      <TextInput style={styles.input} placeholder={placeholder_repeat_password} placeholderTextColor="grey" secureTextEntry autoCapitalize="none" value={repeatPassword} onChangeText={(text) => setRepeatPassword(text)} />
      
      {!passwordsMinLenght && (<Text style={styles.warningText}>{password_min_lenght_warning}</Text>)}
      {!passwordsMatch && (<Text style={styles.warningText}>{passwords_match_warning}</Text>)}

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <CheckBox disabled={false} value={toggleRememberData} tintColors={{ true: '#17202a', false: 'black' }} onValueChange={(newValue) => setToggleRememberData(newValue)}/>
        <Text style={{ color: 'black', marginLeft: 8 }}>{remember_me}</Text>
      </View>

      <Button title={registration_button} onPress={() => handleRegister()} />
      {registrationIsFailed && (<Text style={styles.warningText}>{registration_failed}</Text>)}
      <View style={{marginBottom: 10}}></View>
      <Button title={already_registered} onPress={() => navigation.navigate('Login')} />
      
      <LanguagePicker/>
      {isLoading && <LoadingScreen/>}
      <WebServerUp/>
    </View>
  );
};

export default RegisterPage;
