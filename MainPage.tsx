import React from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import {MainPageScreenProps} from './NavigationTypes'

export function MainPage({ navigation }: MainPageScreenProps): JSX.Element {

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{color: 'black'}}>Main Page : the page that talks about main!</Text>
      </View>
    );
  };
  
  export default MainPage;