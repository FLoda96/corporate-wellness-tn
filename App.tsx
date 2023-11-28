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
import {retrieveUserSession} from './EncryptedStorageUtility'


export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState('');
  const sessionAuthName = 'user_auth'


  useEffect(() => {
    const fetchData = async () => {
      try {
        const session = await retrieveUserSession(sessionAuthName);
        if (session !== undefined) {
          const parsedSession = JSON.parse(session);
          // TO DO : Try to login directly with saved credentials
          if ((parsedSession.user !== null) && (parsedSession.user !== null) && (parsedSession.user !== '')) {
            setUser(parsedSession.user);
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.error('Error retrieving session: ' + error);
      }
    };
    // Roundabout way to call the above but async TO DO : search a library that does this
    fetchData();
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