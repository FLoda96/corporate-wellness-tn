import * as React from 'react';
import { Button, View } from 'react-native';
import { createDrawerNavigator, DrawerContentComponentProps, DrawerNavigationProp } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import * as NavigationTypes from './NavigationTypes'
import {ProfileScreen} from './Profile'



function Login({ navigation }: NavigationTypes.LoginScreenProps): JSX.Element {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        onPress={() => navigation.navigate('MainPage')}
        title="Go to notifications"
      />
    </View>
  );
}

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

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Login" component={Login} />
        <Drawer.Screen name="Profile" component={ProfileScreen} />
        <Drawer.Screen name="AboutUs" component={AboutUs} />
        <Drawer.Screen name="MainPage" component={MainPage} />
        <Drawer.Screen name="NavigationPage" component={NavigationPage} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}