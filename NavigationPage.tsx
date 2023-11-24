import React from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import {NavigationPageScreenProps} from './NavigationTypes'

export function NavigationPage({ navigation }: NavigationPageScreenProps): JSX.Element {

    function StartRoute () {
        console.log('Start Route')
    }


    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button
          onPress={() => StartRoute()}
          title="Start Route"
        />
      </View>
    );
  };
  
  export default NavigationPage;