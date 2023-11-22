import * as React from 'react';
import { Button, View } from 'react-native';
import { createDrawerNavigator, DrawerContentComponentProps, DrawerNavigationProp } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';


type RootDrawerParamList = {
  Home: undefined;
  Notifications: undefined;
  // Add other screens as needed
};

// Define the type for the navigation prop
type HomeScreenNavigationProp = DrawerNavigationProp<RootDrawerParamList, 'Home'>;

// Use the defined type for your component
interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

type NotificationScreenNavigationProp = DrawerNavigationProp<RootDrawerParamList, 'Notifications'>;

// Use the defined type for your component
interface NotificationScreenProps {
  navigation: HomeScreenNavigationProp;
}


function HomeScreen({ navigation }: HomeScreenProps): JSX.Element {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        onPress={() => navigation.navigate('Notifications')}
        title="Go to notifications"
      />
    </View>
  );
}

function NotificationsScreen({ navigation }: NotificationScreenProps): JSX.Element {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.goBack()} title="Go back home" />
    </View>
  );
}

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Notifications" component={NotificationsScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}