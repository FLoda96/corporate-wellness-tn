import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
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
    },
    warningText: {
      color: 'red',
      marginVertical: 5,
    },
    successText: {
      color: 'green',
      marginVertical: 5,
    },
  });