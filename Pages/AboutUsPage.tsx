import React from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import {AboutUsPageScreenProps} from '../Utils/NavigationTypes'
import { styles } from '../Utils/Styles'
import { useTranslation } from 'react-i18next';

export function AboutUsPage({ navigation }: AboutUsPageScreenProps): JSX.Element {
    const { t, i18n } = useTranslation();
    const about_us = t('about_us_page.about_us')

    return (
        <View style={styles.backgroundColor}>
            <Text style={{color: 'black', textAlign: 'center', paddingHorizontal: 20, marginBottom: 10, marginTop: 10, fontSize: 15}}>{about_us}</Text>
      </View>
    );
  };
  
  export default AboutUsPage;