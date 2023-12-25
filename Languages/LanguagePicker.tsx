import { useState, useRef, useEffect } from 'react';
import { Text, View, TouchableOpacity, Image } from "react-native";
import { styles } from '../Utils/Styles';
import { useTranslation } from 'react-i18next';

export const LanguagePicker: React.FC = () => {
const { t, i18n } = useTranslation();

function ChangeLanguage (language: string) {
    i18n.changeLanguage(language);
};
  
  return (
    <View style={styles.languageContainer}>
    <TouchableOpacity onPress={() => ChangeLanguage('en')}>
        <Image style={styles.icon} source={require('../Images/english_flag.png')} />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => ChangeLanguage('it')}>
        <Image style={styles.icon} source={require('../Images/italian_flag.png')} />
    </TouchableOpacity>
    </View>
)};

export default LanguagePicker;
