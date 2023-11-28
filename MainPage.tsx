import React, {useContext} from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import {MainPageScreenProps} from './NavigationTypes'
import {UserContext, UserContextType} from './AuthContext'


export function MainPage({ navigation }: MainPageScreenProps): JSX.Element {
  const {User, SetUser} = useContext(UserContext) as UserContextType;
  
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{color: 'black'}}>Main Page : the page that talks about main!</Text>
            <Text style={{color: 'black'}}>Welcome {User}</Text>
      </View>
    );
  };
  
  export default MainPage;