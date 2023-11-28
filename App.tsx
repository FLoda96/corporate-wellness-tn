import {useState, useContext, useEffect} from 'react';
import { Button, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import {HomeDrawer, AuthStack} from './NavigationTypes'

import {ProfileScreen} from './Profile'
import {LoginScreen} from './LoginScreen'
import {RegisterScreen} from './RegisterScreen'
import {NavigationPage} from './NavigationPage'
import {AboutUsPage} from './AboutUsPage'
import {MainPage} from './MainPage'
import {UserContext, LoginContext} from './AuthContext'


export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState('');

  // TO DO : Add actual logic for like retrieving saved credentials
  useEffect(() => {
    setUser('Test-User');
  }, []);
  
  return (
    <NavigationContainer>
      <UserContext.Provider value={{User : user, SetUser : setUser}}>
      <LoginContext.Provider value={{IsAuthenticated : isAuthenticated, SetIsAuthenticated : setIsAuthenticated}}>
      {isAuthenticated ? (
        <HomeDrawer.Navigator initialRouteName="Main">
          <HomeDrawer.Screen name="Profile" component={ProfileScreen} />
          <HomeDrawer.Screen name="AboutUs" component={AboutUsPage} />
          <HomeDrawer.Screen name="Main" component={MainPage} />
          <HomeDrawer.Screen name="Navigation" component={NavigationPage} />
        </HomeDrawer.Navigator>
      ) : (
        <AuthStack.Navigator initialRouteName="Register">
          <AuthStack.Screen name="Register" component={RegisterScreen} />
          <AuthStack.Screen name="Login" component={LoginScreen} />
        </AuthStack.Navigator>
      )}
      </LoginContext.Provider>
      </UserContext.Provider>
    </NavigationContainer>
  );
}