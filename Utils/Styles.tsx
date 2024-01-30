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
      color: 'black',
    },
    label: {
      color: 'black',
      fontWeight: 'bold',
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
      resizeMode: 'contain',
    },
    icon: {
      width: 45,
      height: 45, 
      resizeMode: 'contain',
    },
    center: {
      alignItems: 'center',
    },
    backgroundColor: {
      backgroundColor: '#a6edd7',
      flex: 1, 
    },
    navigation: {
      flex: 1, 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: '#a6edd7'
    },
    headerTeam: {
      color : 'black',
      fontSize: 25,
      fontWeight: 'bold',
    },
    languageContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    resetButtonWrapper: {
      position: 'absolute',
      bottom: 0,
      width: '100%', // Make sure it takes the full width
      paddingHorizontal: 16, // Optional: Add padding for better styling
      alignItems: 'center'
    },
  });