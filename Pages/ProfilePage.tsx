import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import {ProfilePageProps} from '../Utils/NavigationTypes'
import {retrieveSessionData} from '../Utils/EncryptedStorageUtility'
import { sessionAuthName } from '../Utils/FunctionUtils';
import { SearchUserByEmailResponse, SearchUserByEmail, UpdateUser, ok } from '../Utils/WebServerUtils';
import {UserContext, UserContextType, LoginContext, LoginContextType} from '../Utils/AuthContext'


export function ProfilePage({ navigation }: ProfilePageProps): JSX.Element {
  // State variables for profile parameters
  const [name, setName] = useState<string>('');
  const [surname, setSurname] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [nickname, setNickname] = useState<string>('');
  const [sex, setSex] = useState<string>('');
  const [height, setHeight] = useState<string>('0.0');
  const [weight, setWeight] = useState<string>('0.0');
  const [heartRate, setHeartRate] = useState<string>('0.0');
  const [profileUpdateIsFailed, setProfileUpdateIsFailed] = useState(false);
  const [profileUpdateSuccessfully, setProfileUpdateSuccessfully] = useState(false);
  const {User, SetUser} = useContext(UserContext) as UserContextType;
  var user: SearchUserByEmailResponse | number;

  // Get the profile data from DB
  useEffect(() => {
    const fetchData = async () => {
      LoadProfile();
    };
    // Roundabout way to call the above but async TO DO : search a library that does this
    fetchData();
  }, []);

  async function LoadProfile () {
    try {
      if ((User !== null)) {
        user = await SearchUserByEmail({email : User})
        if (typeof(user) != 'number') {
          if (user.name != null) {
            setName(user.name);
          }
          if (user.surname != null) {
            setSurname(user.surname);
          }
          // Tecnically it should never be updated
          if (user.email != null) {
            setEmail(user.email);
          }
          if (user.nickname != null) {
            setNickname(user.nickname);
          }
          if (user.sex != null) {
            setSex(user.sex);
          }
          if (user.height != null) {
            setHeight(user.height.toString());
          }
          if (user.weight != null) {
            setWeight(user.weight.toString());
          }
          if (user.heart_rate != null) {
            setHeartRate(user.heart_rate.toString());
          }
        }
      }
    }
     catch (error) {
      console.error('Error retrieving session: ' + error);
    }
  }

  // Function to handle saving the profile changes
  // TO DO : If the profile is the same as before do nothing
  async function saveProfile () {
    const response = await UpdateUser({
      name: name, 
      surname: surname, 
      nickname: nickname, 
      email: User, 
      sex: sex, 
      height: parseFloat(height.replace(',','.')), 
      weight: parseFloat(weight.replace(',','.')), 
      heart_rate: parseFloat(heartRate.replace(',','.')) });
    if (response.response_code == ok) {
      console.log('Profile Saved');
      console.log('Loading Saved');
      LoadProfile();
      setProfileUpdateIsFailed(false);
      setProfileUpdateSuccessfully(true);
      LoadProfile();
    } else {
      setProfileUpdateIsFailed(true);
      setProfileUpdateSuccessfully(false);
    }
  };

  // <TextInput style={styles.input} value={email} onChangeText={(text) => setEmail(text)} />

  return (
    <ScrollView style={styles.container}>
      {/* UI for each profile parameter */}
      <Text style={styles.label}>Name:</Text>
      <TextInput style={styles.input} value={name} onChangeText={(text) => setName(text)} />

      <Text style={styles.label}>Surname:</Text>
      <TextInput style={styles.input} value={surname} onChangeText={(text) => setSurname(text)} />

      <Text style={styles.label}>Email:</Text>
      <Text style={styles.label}>{email}</Text>

      <Text style={styles.label}>Nickname:</Text>
      <TextInput style={styles.input} value={nickname} onChangeText={(text) => setNickname(text)} />

      <Text style={styles.label}>Sex:</Text>
      <TextInput style={styles.input} value={sex} onChangeText={(text) => setSex(text)} />

      <Text style={styles.label}>Height (m):</Text>
      <TextInput style={styles.input} keyboardType="numeric" value={height} onChangeText={(text) => setHeight(text)} />

      <Text style={styles.label}>Weight (kg):</Text>
      <TextInput style={styles.input} keyboardType="numeric" value={weight} onChangeText={(text) => setWeight(text)} />

      <Text style={styles.label}>Heart Rate (beats/minute):</Text>
      <TextInput style={styles.input} keyboardType="numeric" value={heartRate} onChangeText={(text) => setHeartRate(text)} />

      <Button title="Save" onPress={saveProfile} />
      {profileUpdateIsFailed && (<Text style={styles.warningText}>Failed to update Profile</Text>)}
      {profileUpdateSuccessfully && (<Text style={styles.successText}>Profile updated successfully</Text>)}
    </ScrollView>
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
  warningText: {
    color: 'red',
    marginVertical: 5,
  },
  successText: {
    color: 'green',
    marginVertical: 5,
  },
});

export default ProfilePage;
