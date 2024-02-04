import React, {useContext, useState} from 'react';
import { View, TextInput, Button, StyleSheet, Text, Image } from 'react-native';
import {ForgotPasswordPageProps} from '../Utils/NavigationTypes'
import {UserContext, UserContextType, LoginContext, LoginContextType, UserIdContext, UserIdContextType} from '../Utils/AuthContext'
import CheckBox from '@react-native-community/checkbox';
import { HandleLogin } from '../Utils/FunctionUtils';
import { LoadingScreen } from '../Utils/LoadingScreen';
import { styles } from '../Utils/Styles'
import { WebServerUp } from '../Utils/WebServerUp'
import { useTranslation } from 'react-i18next';
import { LanguagePicker } from '../Languages/LanguagePicker'
import { GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin';
import { created, SendForgotPasswordEmail } from '../Utils/WebServerUtils'

export function ForgotPasswordPage({ navigation }: ForgotPasswordPageProps): JSX.Element {
  const [toggleRememberData, setToggleRememberData] = useState(false);
  const [loginIsFailed, setLoginIsFailed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState('');
  const {User, SetUser} = useContext(UserContext) as UserContextType;
  const {UserId, SetUserId} = useContext(UserIdContext) as UserIdContextType;
  const {IsAuthenticated, SetIsAuthenticated} = useContext(LoginContext) as LoginContextType;

  const placeholder_email = t('forgot_password.email_placeholder');
  const forgot_password_button = t('forgot_password.send_email_button');
  const error_message = t('forgot_password.error_message');

  async function SendForgotPasswordEmail_Utility () {
    setIsLoading(true);
    const response = await SendForgotPasswordEmail({email: email, timestamp_request: Date.now().toString()});
    if (response == created) {
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }

  return (
    <View style={styles.backgroundColor}>
      <View style={styles.center}><Image style={styles.image} source={require('../Images/MoveApp_Transparent_Background.png')}/></View>

      <Text style={styles.label}>{placeholder_email}:</Text>
      <TextInput style={styles.input} placeholder={placeholder_email} placeholderTextColor="grey" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={(text) => setEmail(text)} />
  
      <Button title={forgot_password_button} onPress={() => SendForgotPasswordEmail_Utility()} />
      {loginIsFailed && (<Text style={styles.warningText}>{error_message}</Text>)}
      <LanguagePicker/>
      {isLoading && <LoadingScreen/>}
      <WebServerUp/>
    </View>
  );
};

export default ForgotPasswordPage;
