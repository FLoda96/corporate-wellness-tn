import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ProfilePageProps } from '../Utils/NavigationTypes'
import { retrieveSessionData } from '../Utils/EncryptedStorageUtility'
import { sessionAuthName } from '../Utils/FunctionUtils';
import { SearchUserByEmailResponse, SearchUserByEmail, UpdateUser, ok } from '../Utils/WebServerUtils';
import { UserContext, UserContextType, LoginContext, LoginContextType } from '../Utils/AuthContext';
import { LoadingScreen } from '../Utils/LoadingScreen';
import { styles } from '../Utils/Styles'
import DatePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { FormatDateofBirth, parseDateString, formatNumber } from '../Utils/FunctionUtils'
import { Picker } from '@react-native-picker/picker';
import { useTranslation } from 'react-i18next';


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
  const [stepLength, setStepLength] = useState<string>('0.0');
  const [profileUpdateIsFailed, setProfileUpdateIsFailed] = useState(false);
  const [profileUpdateSuccessfully, setProfileUpdateSuccessfully] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {User, SetUser} = useContext(UserContext) as UserContextType;
  const { t, i18n } = useTranslation();
  var user: SearchUserByEmailResponse | number;

  const name_label = t('profile_page.name_label');
  const surname_label = t('profile_page.surname_label');
  const date_of_birth_label = t('profile_page.date_of_birth_label');
  const email_label = t('profile_page.email_label');
  const nickname_label = t('profile_page.nickname_label');
  const sex_label = t('profile_page.sex_label');
  const male = t('profile_page.male');
  const female = t('profile_page.female');
  const other = t('profile_page.other');
  const waistline_label = t('profile_page.waistline_label');
  const height_label = t('profile_page.height_label');
  const weight_label = t('profile_page.weight_label');
  const heart_rate_label = t('profile_page.heart_rate_label');
  const step_length_label = t('profile_page.step_length_label');
  const edit_button = t('profile_page.edit_button');
  const save_button = t('profile_page.save_button');
  const failed_update = t('profile_page.failed_update');
  const successfull_update = t('profile_page.successfull_update');


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
            if (user.sex == "Male") {
              setSex(male);
            }
            if (user.sex == "Female") {
              setSex(female);
            }
            if (user.sex == "Other") {
              setSex(other);
            }
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
          if (user.step_length != null) {
            setStepLength(user.step_length.toString());
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
      heart_rate: formatNumber(heartRate),
      step_length: formatNumber(stepLength)});
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
    <ScrollView style={styles.containerColor}>

      <Text style={styles.label}>{name_label}:</Text>
      <TextInput style={styles.input} value={name} editable={isEditing} onChangeText={(text) => setName(text)} />

      <Text style={styles.label}>{surname_label}:</Text>
      <TextInput style={styles.input} value={surname} editable={isEditing} onChangeText={(text) => setSurname(text)} />

      <Text style={styles.label}>{date_of_birth_label}:</Text>
      <TouchableOpacity disabled={!isEditing} onPress={() => setShowDatePicker(true)}>
        <TextInput style={styles.input} value={dateOfBirth.toDateString()} editable={false}/>
      </TouchableOpacity>

      {showDatePicker && ( <DatePicker value={dateOfBirth} mode="date" display="default" onChange={handleDateChange}/>)}

      <Text style={styles.label}>{email_label}:</Text>
      <Text style={styles.label}>{email}</Text>

      {isLoading && <LoadingScreen/>}

      <Text style={styles.label}>{nickname_label}:</Text>
      <TextInput style={styles.input} value={nickname} editable={isEditing} onChangeText={(text) => setNickname(text)} />

      <Text style={styles.label}>{sex_label}:</Text>
      {isEditing ? (
        <Picker
          selectedValue={sex}
          onValueChange={(itemValue) => setSex(itemValue)}
          style={styles.input}
          mode='dropdown'
          dropdownIconRippleColor='#000000'
          dropdownIconColor='#000000'
        >
          <Picker.Item label={male} value="Male" />
          <Picker.Item label={female} value="Female" />
          <Picker.Item label={other} value="Other" />
        </Picker>
      ) : (
        <TextInput style={styles.input} value={sex} editable={isEditing} onChangeText={(text) => setSex(text)} />
      )}

      <Text style={styles.label}>{waistline_label}:</Text>
      <TextInput style={styles.input} keyboardType="numeric" value={waistline} editable={isEditing} onChangeText={(text) => setWaistline(text)} />

      <Text style={styles.label}>{height_label}:</Text>
      <TextInput style={styles.input} keyboardType="numeric" value={height} editable={isEditing} onChangeText={(text) => setHeight(text)} />

      <Text style={styles.label}>{weight_label}:</Text>
      <TextInput style={styles.input} keyboardType="numeric" value={weight} editable={isEditing} onChangeText={(text) => setWeight(text)} />

      <Text style={styles.label}>{heart_rate_label}:</Text>
      <TextInput style={styles.input} keyboardType="numeric" value={heartRate} editable={isEditing} onChangeText={(text) => setHeartRate(text)} />

      <Text style={styles.label}>{step_length_label}:</Text>
      <TextInput style={styles.input} keyboardType="numeric" value={stepLength} editable={isEditing} onChangeText={(text) => setStepLength(text)} />

      <View style={{marginBottom: 20}}></View>

      </ScrollView>
      <View>
        {!isEditing && (<Button title={edit_button} onPress={() => setIsEditing(true)} />)}
        <Button title={save_button} onPress={saveProfile} disabled={!isEditing} />
        {profileUpdateIsFailed && (<Text style={styles.warningText}>{failed_update}</Text>)}
        {profileUpdateSuccessfully && (<Text style={styles.successText}>{successfull_update}</Text>)}
      </View>
      </>
  );
};

export default ProfilePage;
