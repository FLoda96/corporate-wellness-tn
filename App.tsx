import * as React from 'react';
import { Button, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import {HomeDrawer, AuthStack} from './NavigationTypes'

import {ProfileScreen} from './Profile'
import {LoginScreen} from './LoginScreen'
import {RegisterScreen} from './RegisterScreen'
import {NavigationPage} from './NavigationPage'
import {AboutUsPage} from './AboutUsPage'
import {MainPage} from './MainPage'

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(true);
  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <HomeDrawer.Navigator initialRouteName="Main">
          <HomeDrawer.Screen name="Profile" component={ProfileScreen} />
          <HomeDrawer.Screen name="AboutUs" component={AboutUsPage} />
          <HomeDrawer.Screen name="Main" component={MainPage} />
          <HomeDrawer.Screen name="Navigation" component={NavigationPage} />
        </HomeDrawer.Navigator>
      ) : (
        <AuthStack.Navigator>
          <AuthStack.Screen name="Login" component={LoginScreen} />
          <AuthStack.Screen name="Register" component={RegisterScreen} />
        </AuthStack.Navigator>
      )}
    </NavigationContainer>
  );
}