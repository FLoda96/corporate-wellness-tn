import {useState, useContext, useEffect} from 'react';
import { Button, View, Alert, ActivityIndicator } from 'react-native';

import { useTranslation } from 'react-i18next';
import './Languages/i18n'

import { NavigationContainer } from '@react-navigation/native';
import {HomeDrawer, AuthStack} from './Utils/NavigationTypes'

import {ProfilePage} from './Pages/ProfilePage'
import {LoginPage} from './Pages/LoginPage'
import {RegisterPage} from './Pages/RegisterPage'
import {NavigationPage} from './Pages/NavigationPage'
import {AboutUsPage} from './Pages/AboutUsPage'
import {MainPage} from './Pages/MainPage'
import {TeamPage} from './Pages/TeamPage'
import {NavigationLoadingPage} from './Pages/NavigationLoadingPage'
import {UserContext, LoginContext, UserIdContext} from './Utils/AuthContext'
import {retrieveSessionData} from './Utils/EncryptedStorageUtility'
import { HandleLogin, sessionAuthName } from './Utils/FunctionUtils';
import { LoadingScreen } from './Utils/LoadingScreen';


// TO DO : Save the language in the storage to recover the preference
// TO DO : Extend the WebServerUp to all pages
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(0);
  const { t, i18n } = useTranslation();
  const toggleRememberDataPlaceholder = false;

  const register = t('pages_names.register');
  const login = t('pages_names.login');
  const profile = t('pages_names.profile');
  const main_page = t('pages_names.main_page');
  const teams = t('pages_names.teams');
  const about_us = t('pages_names.about_us');
  const navigation = t('pages_names.navigation');


  // TO DO : Is loogin with the remembered credential the right move ? do i want the app to be accessible even offline ?
  useEffect(() => {
    const fetchData = async () => {
      try {
        const session = await retrieveSessionData(sessionAuthName);
        if (session !== undefined) {
          const parsedSession = JSON.parse(session);
          if ((parsedSession.email !== null) && (parsedSession.password !== null)) {
            HandleLogin({email : parsedSession.email, password : parsedSession.password, toggleRememberData : toggleRememberDataPlaceholder, setUser : setUser, setUserId : setUserId, setIsAuthenticated : setIsAuthenticated})
          }
        }
      } catch (error) {
        console.error('Error retrieving session: ' + error);
      }
    };
    // Roundabout way to call the above but async TO DO : search a library that does this
    fetchData();
  }, []);

  const loading_notice = t('alerts.loading_notice');
  const loading_alert = t('alerts.loading_alert');

    function showLoadingAlert () {
        Alert.alert(
        loading_notice,
        loading_alert,
        [{ text: 'Ok', style: 'default',}]);
    }

  // options={{ headerTitle : () =>  <Button title='Disconnect'/>}}
  // TO DO : There must be a way to put the option in some style file, probably some TypeScript annoyance
  return (
    <NavigationContainer>
      <UserContext.Provider value={{User : user, SetUser : setUser}}>
      <UserIdContext.Provider value={{UserId : userId, SetUserId : setUserId}}>
      <LoginContext.Provider value={{IsAuthenticated : isAuthenticated, SetIsAuthenticated : setIsAuthenticated}}>
      {isAuthenticated ? (
        <>
        <HomeDrawer.Navigator initialRouteName="Main" screenOptions={{headerStyle: {backgroundColor: '#11ab7a',}, headerTintColor: '#fff', headerTitleStyle: {fontWeight: 'bold',}}}>
          <HomeDrawer.Screen name="Profile" component={ProfilePage} options={{ title: profile}} />
          <HomeDrawer.Screen name="Teams" component={TeamPage} options={{ title: teams}} />
          <HomeDrawer.Screen name="AboutUs" component={AboutUsPage} options={{ title: about_us}} />
          <HomeDrawer.Screen name="Main" component={MainPage} options={{ title: main_page}} />
          <HomeDrawer.Screen name="Navigation" component={NavigationPage} options={{ title: navigation}} listeners={{drawerItemPress: (e) => {showLoadingAlert()}}} />
          {/*<HomeDrawer.Screen name="LoadingNavigation" component={NavigationLoadingPage} options={{ title: "navigation_load"}} />*/}
        </HomeDrawer.Navigator>
        </>
      ) : (
        <AuthStack.Navigator initialRouteName="Register" screenOptions={{headerStyle: {backgroundColor: '#11ab7a',}, headerTintColor: '#fff', headerTitleStyle: {fontWeight: 'bold',}}}>
          <AuthStack.Screen name="Register" component={RegisterPage} options={{ title: register}} />
          <AuthStack.Screen name="Login" component={LoginPage} options={{ title: login}}/>
        </AuthStack.Navigator>
      )}
      </LoginContext.Provider>
      </UserIdContext.Provider>
      </UserContext.Provider>
    </NavigationContainer>
  );
}