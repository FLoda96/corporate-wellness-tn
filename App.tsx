import {useState, useContext, useEffect} from 'react';
import { Button, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import {HomeDrawer, AuthStack} from './Utils/NavigationTypes'

import {ProfilePage} from './Pages/ProfilePage'
import {LoginPage} from './Pages/LoginPage'
import {RegisterPage} from './Pages/RegisterPage'
import {NavigationPage} from './Pages/NavigationPage'
import {AboutUsPage} from './Pages/AboutUsPage'
import {MainPage} from './Pages/MainPage'
import {UserContext, LoginContext} from './Utils/AuthContext'
import {retrieveUserSession} from './Utils/EncryptedStorageUtility'


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
          <HomeDrawer.Screen name="Profile" component={ProfilePage} />
          <HomeDrawer.Screen name="AboutUs" component={AboutUsPage} />
          <HomeDrawer.Screen name="Main" component={MainPage} />
          <HomeDrawer.Screen name="Navigation" component={NavigationPage} />
        </HomeDrawer.Navigator>
      ) : (
        <AuthStack.Navigator initialRouteName="Register">
          <AuthStack.Screen name="Register" component={RegisterPage} />
          <AuthStack.Screen name="Login" component={LoginPage} />
        </AuthStack.Navigator>
      )}
      </LoginContext.Provider>
      </UserContext.Provider>
    </NavigationContainer>
  );
}