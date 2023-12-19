import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
    },
    containerColor: {
      flex: 1,
      padding: 20,
      backgroundColor: '#a6edd7',
    },
    input: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 10,
      paddingHorizontal: 10,
      color: 'black', // Set text color to black
    },
    label: {
      color: 'black', // Set label color to black
      marginBottom: 5,
      marginLeft: 5,
      marginTop: 3,
    },
    warningText: {
      color: 'red',
      marginVertical: 5,
    },
    successText: {
      color: 'green',
      marginVertical: 5,
    },
    image: {
      width: 200,
      height: 200, 
      resizeMode: 'contain', // You can use 'cover', 'contain', 'stretch', etc.
    },
    center: {
      alignItems: 'center',
    },
    backgroundColor: {
      backgroundColor: '#a6edd7',
    },
    navigation: {
      flex: 1, 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: '#a6edd7'
    }
  });