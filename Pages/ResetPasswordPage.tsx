import React, {useContext, useState, useEffect, useRef} from 'react';
import { View, TextInput, Button, Text, Image, Linking } from 'react-native';
import {ResetPasswordPageProps} from '../Utils/NavigationTypes'
import {UserContext, UserContextType, LoginContext, LoginContextType, UserIdContext, UserIdContextType} from '../Utils/AuthContext'
import { HandleLogin } from '../Utils/FunctionUtils';
import { LoadingScreen } from '../Utils/LoadingScreen';
import { styles } from '../Utils/Styles'
import { WebServerUp } from '../Utils/WebServerUp'
import { useTranslation } from 'react-i18next';
import { LanguagePicker } from '../Languages/LanguagePicker'
import 'react-native-url-polyfill/auto';
import { UpdateAuth, ok, CheckMailForgetPassword } from '../Utils/WebServerUtils';


export function ResetPasswordPage({ navigation }: ResetPasswordPageProps): JSX.Element {
  const [toggleRememberData, setToggleRememberData] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [passwordsMinLenght, setPasswordsMinLenght] = useState(true);
  const emailCheck = useRef('');
  const code = useRef('');
  const [isLinkValid, setIsLinkValid] = useState(false);
  const {User, SetUser} = useContext(UserContext) as UserContextType;
  const {UserId, SetUserId} = useContext(UserIdContext) as UserIdContextType;
  const {IsAuthenticated, SetIsAuthenticated} = useContext(LoginContext) as LoginContextType;

  const placeholder_email = t('reset_password.email_placeholder');
  const placeholder_password = t('reset_password.password_placeholder');
  const placeholder_repeat_password = t('reset_password.repeat_password_placeholder');
  const password_min_lenght_warning = t('reset_password.password_min_lenght_warning');
  const passwords_match_warning = t('reset_password.passwords_match_warning');
  const reset_password_button = t('reset_password.reset_password_button');
  const error_message = t('reset_password.error_message');
  const go_back_to_login_button = t('reset_password.go_back_to_login_button');

  // Es. command to test : adb shell am start -W -a android.intent.action.VIEW -d "http://www.moveappapp.com/password?email=test@abc.com%26abc123"
  useEffect(() => {
    const fetchData = async () => {
        const url = await Linking.getInitialURL();
        console.log(url);
        if (url != null) {
          const parsedUrl = new URL(url);
          const parametersValue = parsedUrl.searchParams.get('email');
          if (parametersValue != null) {
            let parameters = parametersValue.split('&');
            setEmail(parameters[0]);
            // because the state is not always updated in time for the request
            emailCheck.current = parameters[0];
            console.log(parameters[0]);
            code.current = (parameters[1]);
            console.log(parameters[1]);
          }
        }
        const CheckMailForgetPasswordResponse = await CheckMailForgetPassword({email: emailCheck.current, code: code.current});
        if (CheckMailForgetPasswordResponse == ok) {
          setIsLinkValid(true);
        }        
    };
    // Roundabout way to call the above but async TO DO : search a library that does this
    fetchData();
  }, []);

  async function ResetPassword () {
    
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

  setIsLoading(true);
    const UpdateAuthResponse = await UpdateAuth({email : email, password : password });
    if (UpdateAuthResponse == ok) {
      HandleLogin({email : email, password : password, toggleRememberData : toggleRememberData, setUser : SetUser, setUserId: SetUserId, setIsAuthenticated : SetIsAuthenticated});
    } else {
      console.log("Something went wrong")
      setIsLoading(false);
    }
  }
  // TO DO : Use just one shared block for the password & repeat
  return (
    <View style={styles.backgroundColor}>
      <View style={styles.center}><Image style={styles.image} source={require('../Images/MoveApp_Transparent_Background.png')}/></View>
      
      {isLinkValid ? (<>
      <Text style={styles.label}>{placeholder_email}:</Text>
      <Text style={styles.label}>{email}:</Text>

      <Text style={styles.label}>{placeholder_password}:</Text>
      <TextInput style={styles.input} placeholder={placeholder_password} placeholderTextColor="grey" secureTextEntry autoCapitalize="none" value={password} onChangeText={(text) => setPassword(text)} />
      <Text style={styles.label}>{placeholder_repeat_password}:</Text>
      <TextInput style={styles.input} placeholder={placeholder_repeat_password} placeholderTextColor="grey" secureTextEntry autoCapitalize="none" value={repeatPassword} onChangeText={(text) => setRepeatPassword(text)} />
      
      {!passwordsMinLenght && (<Text style={styles.warningText}>{password_min_lenght_warning}</Text>)}
      {!passwordsMatch && (<Text style={styles.warningText}>{passwords_match_warning}</Text>)}

      <Button title={reset_password_button} onPress={() => ResetPassword()} />
      <LanguagePicker/>
      {isLoading && <LoadingScreen/>}
      <WebServerUp/>
      </>) 
      : 
      ( <>
        <Text style={{ color: 'red', textAlign: 'center', paddingHorizontal: 45, marginBottom: 10, fontSize: 15 }}> {error_message} </Text>
        <Button title={go_back_to_login_button} onPress={() => navigation.navigate('Login')} />
      </>)}
    </View>
  );
};

export default ResetPasswordPage;
