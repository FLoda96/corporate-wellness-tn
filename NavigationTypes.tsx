import { DrawerNavigationProp, createDrawerNavigator } from '@react-navigation/drawer';
import { StackNavigationProp, createStackNavigator } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

type RootDrawerParamList = {
  Auth: undefined;
  Profile: undefined;
  AboutUs: undefined;
  MainPage: undefined;
  NavigationPage: undefined;
  // Add other screens as needed
};

export const HomeDrawer = createDrawerNavigator<RootDrawerParamList>();

// Define the type for the navigation prop
type AuthNavigationProp = DrawerNavigationProp<RootDrawerParamList, 'Auth'>;
type ProfileScreenNavigationProp = DrawerNavigationProp<RootDrawerParamList, 'Profile'>;
type AboutUsScreenNavigationProp = DrawerNavigationProp<RootDrawerParamList, 'AboutUs'>;
type MainPageScreenNavigationProp = DrawerNavigationProp<RootDrawerParamList, 'MainPage'>;
type NavigationPageScreenNavigationProp = DrawerNavigationProp<RootDrawerParamList, 'NavigationPage'>;

// Use the defined type for your component
export interface AuthProps {
  navigation: AuthNavigationProp;
}

export interface ProfileScreenProps {
  navigation: ProfileScreenNavigationProp;
}

export interface AboutUsScreenProps {
  navigation: AboutUsScreenNavigationProp;
}

export interface MainPageScreenProps {
  navigation: MainPageScreenNavigationProp;
}

export interface NavigationPageScreenProps {
  navigation: NavigationPageScreenNavigationProp;
}


type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  // Add other screens as needed
};

// Create the navigator
export const AuthStack = createStackNavigator<RootStackParamList>();

// Define the type for the navigation prop
type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;
type RegisterScreenScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

// Use the defined type for your component
export interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}

export interface RegisterScreenProps {
  navigation: RegisterScreenScreenNavigationProp;
}