import React from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import {AboutUsPageScreenProps} from './NavigationTypes'

export function AboutUsPage({ navigation }: AboutUsPageScreenProps): JSX.Element {

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{color: 'black'}}>About Us : the page that talks about us!</Text>
      </View>
    );
  };
  
  export default AboutUsPage;