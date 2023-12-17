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
import {UserContext, LoginContext, UserIdContext} from './Utils/AuthContext'
import {retrieveSessionData} from './Utils/EncryptedStorageUtility'
import { HandleLogin, sessionAuthName } from './Utils/FunctionUtils';



// TO DO : Extend the WebServerUp to all pages
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState('');
  const [userId, setUserId] = useState(0);
  const toggleRememberDataPlaceholder = false;
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
  
  return (
    <NavigationContainer>
      <UserContext.Provider value={{User : user, SetUser : setUser}}>
      <UserIdContext.Provider value={{UserId : userId, SetUserId : setUserId}}>
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
      </UserIdContext.Provider>
      </UserContext.Provider>
    </NavigationContainer>
  );
}