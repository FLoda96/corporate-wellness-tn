import {useState, useContext, useEffect} from 'react';
import { Button, View, Alert, ActivityIndicator, Linking } from 'react-native';

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
import {UserContext, LoginContext, UserIdContext} from './Utils/AuthContext'


export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState('');
  const [userId, setUserId] = useState(0);
  const { t, i18n } = useTranslation();
  const toggleRememberDataPlaceholder = false;

  const linking = {
    prefixes: ['moveapp://', 'http://www.moveappapp.com'],
  };

  const register = t('pages_names.register');
  const login = t('pages_names.login');
  const profile = t('pages_names.profile');
  const main_page = t('pages_names.main_page');
  const teams = t('pages_names.teams');
  const about_us = t('pages_names.about_us');
  const navigation = t('pages_names.navigation');


  // options={{ headerTitle : () =>  <Button title='Disconnect'/>}}
  // <HomeDrawer.Screen name="Navigation" component={NavigationPage} options={{ title: navigation, lazy: false}}  listeners={{drawerItemPress: (e) => {setIsLoading(true)}, focus: (e) => {setIsLoading(false)}}} />
  // TO DO : There must be a way to put the option in some style file, probably some TypeScript annoyance
  return (
    <NavigationContainer linking={linking}>
      <UserContext.Provider value={{User : user, SetUser : setUser}}>
      <UserIdContext.Provider value={{UserId : userId, SetUserId : setUserId}}>
      <LoginContext.Provider value={{IsAuthenticated : isAuthenticated, SetIsAuthenticated : setIsAuthenticated}}>
      {isAuthenticated ? (
        <>
        <HomeDrawer.Navigator initialRouteName="Main" screenOptions={{headerStyle: {backgroundColor: '#11ab7a',}, headerTintColor: '#fff', headerTitleStyle: {fontWeight: 'bold',}}} backBehavior='none'>
          <HomeDrawer.Screen name="Profile" component={ProfilePage} options={{ title: profile}} />
          <HomeDrawer.Screen name="Teams" component={TeamPage} options={{ title: teams}} />
          <HomeDrawer.Screen name="AboutUs" component={AboutUsPage} options={{ title: about_us}} />
          <HomeDrawer.Screen name="Main" component={MainPage} options={{ title: main_page}} />
          <HomeDrawer.Screen name="Navigation" component={NavigationPage} options={{ title: navigation, lazy: false }}/>
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