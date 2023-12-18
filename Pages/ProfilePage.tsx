import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import {ProfilePageProps} from '../Utils/NavigationTypes'
import {retrieveSessionData} from '../Utils/EncryptedStorageUtility'
import { sessionAuthName } from '../Utils/FunctionUtils';
import { SearchUserByEmailResponse, SearchUserByEmail, UpdateUser, ok } from '../Utils/WebServerUtils';
import {UserContext, UserContextType, LoginContext, LoginContextType} from '../Utils/AuthContext';
import { LoadingScreen } from '../Utils/LoadingScreen';
import { styles } from '../Utils/Styles'
import DatePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { FormatDateofBirth, parseDateString, formatNumber } from '../Utils/FunctionUtils'
import {Picker} from '@react-native-picker/picker';


// TO DO : Extensive testing on this thing here cause i don't trust dates
export function ProfilePage({ navigation }: ProfilePageProps): JSX.Element {
  // State variables for profile parameters
  const [name, setName] = useState<string>('');
  const [surname, setSurname] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [dateOfBirth, setDateOfBirth] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [nickname, setNickname] = useState<string>('');
  const [sex, setSex] = useState<string>('');
  const [waistline, setWaistline] = useState<string>('');
  const [height, setHeight] = useState<string>('0.0');
  const [weight, setWeight] = useState<string>('0.0');
  const [heartRate, setHeartRate] = useState<string>('0.0');
  const [profileUpdateIsFailed, setProfileUpdateIsFailed] = useState(false);
  const [profileUpdateSuccessfully, setProfileUpdateSuccessfully] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {User, SetUser} = useContext(UserContext) as UserContextType;
  var user: SearchUserByEmailResponse | number;

  // TO DO : Maybe a scroll view just for the variables so that the buttons are always visible ?
  // Get the profile data from DB
  useEffect(() => {
    const fetchData = async () => {
      LoadProfile();
    };
    // Roundabout way to call the above but async TO DO : search a library that does this
    fetchData();
  }, []);

  async function LoadProfile () {
    setIsLoading(true);
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
          if (user.date_of_birth != null) {
            setDateOfBirth(parseDateString(user.date_of_birth));
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
          if (user.waistline != null) {
            setWaistline(user.waistline.toString());
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
          setIsLoading(false);
        }
      }
    }
     catch (error) {
      setIsLoading(false);
      console.error('Error retrieving session: ' + error);
    }
  }

  const handleDateChange = (event: DateTimePickerEvent, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || dateOfBirth;
    setShowDatePicker(false);
    setDateOfBirth(currentDate);
  };

  // Function to handle saving the profile changes
  // TO DO : If the profile is the same as before do nothing
  async function saveProfile () {
    setIsLoading(true);
    const response = await UpdateUser({
      name: name, 
      surname: surname, 
      date_of_birth: FormatDateofBirth(dateOfBirth),
      nickname: nickname, 
      email: User, 
      sex: sex, 
      waistline: formatNumber(waistline),
      height: formatNumber(height), 
      weight: formatNumber(weight), 
      heart_rate: formatNumber(heartRate)});
    if (response.response_code == ok) {
      console.log('Profile Saved');
      setIsEditing(false);
      console.log('Loading Saved Profile');
      LoadProfile();
      setProfileUpdateIsFailed(false);
      setProfileUpdateSuccessfully(true);
      setIsLoading(false);
    } else {
      setProfileUpdateIsFailed(true);
      setProfileUpdateSuccessfully(false);
      setIsLoading(false);
    }
  };

  return ( 
    <>
    <ScrollView style={styles.container}>

      <Text style={styles.label}>Name:</Text>
      <TextInput style={styles.input} value={name} editable={isEditing} onChangeText={(text) => setName(text)} />

      <Text style={styles.label}>Surname:</Text>
      <TextInput style={styles.input} value={surname} editable={isEditing} onChangeText={(text) => setSurname(text)} />

      <Text style={styles.label}>Date of Birth:</Text>
      <TouchableOpacity disabled={!isEditing} onPress={() => setShowDatePicker(true)}>
        <TextInput style={styles.input} value={dateOfBirth.toDateString()} editable={false}/>
      </TouchableOpacity>

      {showDatePicker && ( <DatePicker value={dateOfBirth} mode="date" display="default" onChange={handleDateChange}/>)}

      <Text style={styles.label}>Email:</Text>
      <Text style={styles.label}>{email}</Text>

      {isLoading && <LoadingScreen/>}

      <Text style={styles.label}>Nickname:</Text>
      <TextInput style={styles.input} value={nickname} editable={isEditing} onChangeText={(text) => setNickname(text)} />

      <Text style={styles.label}>Sex:</Text>
      {isEditing ? (
        <Picker
          selectedValue={sex}
          onValueChange={(itemValue) => setSex(itemValue)}
          style={styles.input}
          mode='dropdown'
          dropdownIconRippleColor='#000000'
          dropdownIconColor='#000000'
        >
          <Picker.Item label="Male" value="Male" />
          <Picker.Item label="Female" value="Female" />
          <Picker.Item label="Other" value="Other" />
        </Picker>
      ) : (
        <TextInput style={styles.input} value={sex} editable={isEditing} onChangeText={(text) => setSex(text)} />
      )}

      <Text style={styles.label}>Waistline (cm):</Text>
      <TextInput style={styles.input} keyboardType="numeric" value={waistline} editable={isEditing} onChangeText={(text) => setWaistline(text)} />

      <Text style={styles.label}>Height (m):</Text>
      <TextInput style={styles.input} keyboardType="numeric" value={height} editable={isEditing} onChangeText={(text) => setHeight(text)} />

      <Text style={styles.label}>Weight (kg):</Text>
      <TextInput style={styles.input} keyboardType="numeric" value={weight} editable={isEditing} onChangeText={(text) => setWeight(text)} />

      <Text style={styles.label}>Heart Rate (beats/minute):</Text>
      <TextInput style={styles.input} keyboardType="numeric" value={heartRate} editable={isEditing} onChangeText={(text) => setHeartRate(text)} />
      </ScrollView>
      <View>
        {!isEditing && (<Button title="Edit" onPress={() => setIsEditing(true)} />)}
        <Button title="Save" onPress={saveProfile} disabled={!isEditing} />
        {profileUpdateIsFailed && (<Text style={styles.warningText}>Failed to update Profile</Text>)}
        {profileUpdateSuccessfully && (<Text style={styles.successText}>Profile updated successfully</Text>)}
      </View>
      </>
  );
};

export default ProfilePage;
