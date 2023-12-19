import React from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import {AboutUsPageScreenProps} from '../Utils/NavigationTypes'
import { styles } from '../Utils/Styles'

export function AboutUsPage({ navigation }: AboutUsPageScreenProps): JSX.Element {
    const AboutUs = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent semper, velit eget interdum semper, ante risus mattis dui, quis consectetur libero velit ac nisi. Donec rhoncus sed enim sed sagittis. Mauris metus elit, placerat quis turpis vitae, luctus blandit urna. Nam tempor mauris non lectus pellentesque, in luctus nibh consectetur. Proin nibh tellus, interdum vitae porta a, ultricies sit amet odio. Maecenas varius id eros ut elementum. Integer feugiat nulla libero, non scelerisque nisi faucibus vestibulum. Pellentesque ac eros tristique purus aliquam scelerisque. Aenean semper eu quam eu molestie. Nullam accumsan magna quis lobortis semper. Phasellus suscipit accumsan hendrerit. '

    return (
        <View style={styles.backgroundColor}>
            <Text style={{color: 'black', textAlign: 'center', paddingHorizontal: 20, marginBottom: 10, marginTop: 10, fontSize: 15}}>{AboutUs}</Text>
      </View>
    );
  };
  
  export default AboutUsPage;