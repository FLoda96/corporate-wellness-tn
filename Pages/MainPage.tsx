import React, {useContext} from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import {MainPageScreenProps} from '../Utils/NavigationTypes'
import {UserContext, UserContextType, LoginContext, LoginContextType} from '../Utils/AuthContext'
import {saveSessionData, removeSessionData} from '../Utils/EncryptedStorageUtility'
import { HandleLogin, sessionAuthName } from '../Utils/FunctionUtils';



export function MainPage({ navigation }: MainPageScreenProps): JSX.Element {
  const {User, SetUser} = useContext(UserContext) as UserContextType;
  const {IsAuthenticated, SetIsAuthenticated} = useContext(LoginContext) as LoginContextType;
//  const sessionAuthName = 'user_auth'

  function Disconnect() {
    removeSessionData(sessionAuthName);
    SetUser('');
    SetIsAuthenticated(false);
  }

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{color: 'black'}}>Main Page : the page that talks about main!</Text>
            <Text style={{color: 'black'}}>Welcome {User}</Text>
            <Button title="Disconnect" onPress={() => Disconnect()} />
      </View>
    );
  };
  
  export default MainPage;