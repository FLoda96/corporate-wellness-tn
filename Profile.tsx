import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import {ProfileScreenProps} from './NavigationTypes'

export function ProfileScreen({ navigation }: ProfileScreenProps): JSX.Element {
  // State variables for profile parameters
  const [name, setName] = useState<string>('John');
  const [surname, setSurname] = useState<string>('Doe');
  const [email, setEmail] = useState<string>('john.doe@example.com');
  const [nickname, setNickname] = useState<string>('johndoe');
  const [sex, setSex] = useState<string>('Male');
  const [height, setHeight] = useState<string>('175');
  const [weight, setWeight] = useState<string>('70');
  const [heartRate, setHeartRate] = useState<string>('75');

  // Function to handle saving the profile changes
  const saveProfile = () => {
    // In a real app, you would send a request to save these changes to the backend
    console.log('Profile saved:', { name, surname, email, nickname, sex, height, weight, heartRate });
  };

  return (
    <View style={styles.container}>
      {/* UI for each profile parameter */}
      <Text style={styles.label}>Name:</Text>
      <TextInput style={styles.input} value={name} onChangeText={(text) => setName(text)} />

      <Text style={styles.label}>Surname:</Text>
      <TextInput style={styles.input} value={surname} onChangeText={(text) => setSurname(text)} />

      <Text style={styles.label}>Email:</Text>
      <TextInput style={styles.input} value={email} onChangeText={(text) => setEmail(text)} />

      <Text style={styles.label}>Nickname:</Text>
      <TextInput style={styles.input} value={nickname} onChangeText={(text) => setNickname(text)} />

      <Text style={styles.label}>Sex:</Text>
      <TextInput style={styles.input} value={sex} onChangeText={(text) => setSex(text)} />

      <Text style={styles.label}>Height:</Text>
      <TextInput style={styles.input} value={height} onChangeText={(text) => setHeight(text)} />

      <Text style={styles.label}>Weight:</Text>
      <TextInput style={styles.input} value={weight} onChangeText={(text) => setWeight(text)} />

      <Text style={styles.label}>Heart Rate:</Text>
      <TextInput style={styles.input} value={heartRate} onChangeText={(text) => setHeartRate(text)} />

      {/* Save button */}
      <Button title="Save" onPress={saveProfile} />
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default ProfileScreen;
