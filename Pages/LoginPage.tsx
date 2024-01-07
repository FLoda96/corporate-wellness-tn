import React, {useContext, useState} from 'react';
import { View, TextInput, Button, StyleSheet, Text, Image } from 'react-native';
import {LoginPageProps} from '../Utils/NavigationTypes'
import {UserContext, UserContextType, LoginContext, LoginContextType, UserIdContext, UserIdContextType} from '../Utils/AuthContext'
import CheckBox from '@react-native-community/checkbox';
import { HandleLogin } from '../Utils/FunctionUtils';
import { LoadingScreen } from '../Utils/LoadingScreen';
import { styles } from '../Utils/Styles'
import { WebServerUp } from '../Utils/WebServerUp'
import { useTranslation } from 'react-i18next';
import { LanguagePicker } from '../Languages/LanguagePicker'
import { GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin';

  // TO DO : Add function to recover password
  // TO DO : Add function to delete user
  // TO DO : Add warning about non existing account or something
  // TO DO : Implement Lock or something after n login attempt ?
export function LoginPage({ navigation }: LoginPageProps): JSX.Element {
  const [toggleRememberData, setToggleRememberData] = useState(false);
  const [loginIsFailed, setLoginIsFailed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState('test@abc.com');
  const [password, setPassword] = useState('aaaaaa');
  //const [name, setName] = useState('test-name');
  const {User, SetUser} = useContext(UserContext) as UserContextType;
  const {UserId, SetUserId} = useContext(UserIdContext) as UserIdContextType;
  const {IsAuthenticated, SetIsAuthenticated} = useContext(LoginContext) as LoginContextType;

  const placeholder_email = t('login_page.email_placeholder');
  const placeholder_password = t('login_page.password_placeholder');
  const login_button = t('login_page.login_button');
  const register_instead_button = t('login_page.register_instead_button');
  const forgot_password_button = t('login_page.forgot_password_button');
  const remember_me = t('login_page.remember_me');
  const login_failed = t('login_page.login_failed');

  async function Login () {
    setIsLoading(true);
    const success = await HandleLogin({email : email, password : password, toggleRememberData : toggleRememberData, setUser : SetUser, setUserId: SetUserId, setIsAuthenticated : SetIsAuthenticated});
    if (!success) {
      setLoginIsFailed(true);
      setIsLoading(false);
    }
  }

  return (
    <View style={styles.backgroundColor}>
      <View style={styles.center}><Image style={styles.image} source={require('../Images/MoveApp_Transparent_Background.png')}/></View>

      <Text style={styles.label}>{placeholder_email}:</Text>
      <TextInput style={styles.input} placeholder={placeholder_email} placeholderTextColor="grey" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={(text) => setEmail(text)} />
      <Text style={styles.label}>{placeholder_password}:</Text>
      <TextInput style={styles.input} placeholder={placeholder_password} placeholderTextColor="grey" secureTextEntry autoCapitalize="none" value={password} onChangeText={(text) => setPassword(text)} />
      
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <CheckBox disabled={false} value={toggleRememberData} tintColors={{ true: '#17202a', false: 'black' }} onValueChange={(newValue) => setToggleRememberData(newValue)}/>
        <Text style={{ color: 'black', marginLeft: 8 }}>{remember_me}</Text>
      </View>
      
      <Button title={login_button} onPress={() => Login()} />
      {loginIsFailed && (<Text style={styles.warningText}>{login_failed}</Text>)}
      <View style={{marginBottom: 10}}></View>
      <Button title={register_instead_button} onPress={() => navigation.navigate('Register')} />
      <View style={{marginBottom: 10}}></View>
      <Button title={forgot_password_button} onPress={() => navigation.navigate('ForgotPassword')} />
      {/*<GoogleSigninButton size={GoogleSigninButton.Size.Wide} color={GoogleSigninButton.Color.Dark} onPress={() => {}}/>*/}
      <LanguagePicker/>
      {isLoading && <LoadingScreen/>}
      <WebServerUp/>
    </View>
  );
};

export default LoginPage;
