import * as React from 'react';
import { Button, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import * as NavigationTypes from './NavigationTypes'
import {ProfileScreen} from './Profile'
import {LoginScreen} from './LoginScreen'
import {RegisterScreen} from './RegisterScreen'

function AboutUs({ navigation }: NavigationTypes.AboutUsScreenProps): JSX.Element {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        onPress={() => navigation.navigate('MainPage')}
        title="Go to notifications"
      />
    </View>
  );
}

function MainPage({ navigation }: NavigationTypes.MainPageScreenProps): JSX.Element {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        onPress={() => navigation.navigate('MainPage')}
        title="Go to notifications"
      />
    </View>
  );
}


function NavigationPage({ navigation }: NavigationTypes.NavigationPageScreenProps): JSX.Element {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        onPress={() => navigation.navigate('MainPage')}
        title="Go to notifications"
      />
    </View>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(true);
  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <NavigationTypes.HomeDrawer.Navigator initialRouteName="MainPage">
          <NavigationTypes.HomeDrawer.Screen name="Profile" component={ProfileScreen} />
          <NavigationTypes.HomeDrawer.Screen name="AboutUs" component={AboutUs} />
          <NavigationTypes.HomeDrawer.Screen name="MainPage" component={MainPage} />
          <NavigationTypes.HomeDrawer.Screen name="NavigationPage" component={NavigationPage} />
        </NavigationTypes.HomeDrawer.Navigator>
      ) : (
        <NavigationTypes.AuthStack.Navigator>
          <NavigationTypes.AuthStack.Screen name="Login" component={LoginScreen} />
          <NavigationTypes.AuthStack.Screen name="Register" component={RegisterScreen} />
        </NavigationTypes.AuthStack.Navigator>
      )}
    </NavigationContainer>
  );
}