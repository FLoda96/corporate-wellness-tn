import { DrawerNavigationProp } from '@react-navigation/drawer';

type RootDrawerParamList = {
  Login: undefined;
  Profile: undefined;
  AboutUs: undefined;
  MainPage: undefined;
  NavigationPage: undefined;
  // Add other screens as needed
};

// Define the type for the navigation prop
type LoginScreenNavigationProp = DrawerNavigationProp<RootDrawerParamList, 'Login'>;
type ProfileScreenNavigationProp = DrawerNavigationProp<RootDrawerParamList, 'Profile'>;
type AboutUsScreenNavigationProp = DrawerNavigationProp<RootDrawerParamList, 'AboutUs'>;
type MainPageScreenNavigationProp = DrawerNavigationProp<RootDrawerParamList, 'MainPage'>;
type NavigationPageScreenNavigationProp = DrawerNavigationProp<RootDrawerParamList, 'NavigationPage'>;

// Use the defined type for your component
export interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
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