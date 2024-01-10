import { DrawerNavigationProp, createDrawerNavigator } from '@react-navigation/drawer';
import { StackNavigationProp, createStackNavigator } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

type RootDrawerParamList = {
  Auth: undefined;
  Questionnaire: undefined;
  Teams: undefined;
  Profile: undefined;
  AboutUs: undefined;
  Main: undefined;
  Navigation: undefined;
  // Add other screens as needed
};

export const HomeDrawer = createDrawerNavigator<RootDrawerParamList>();

// Define the type for the navigation prop
type AuthNavigationProp = DrawerNavigationProp<RootDrawerParamList, 'Auth'>;
type QuestionnaireNavigationProp = DrawerNavigationProp<RootDrawerParamList, 'Questionnaire'>;
type ProfilePageNavigationProp = DrawerNavigationProp<RootDrawerParamList, 'Profile'>;
type TeamsPageNavigationProp = DrawerNavigationProp<RootDrawerParamList, 'Teams'>;
type AboutUsPageScreenNavigationProp = DrawerNavigationProp<RootDrawerParamList, 'AboutUs'>;
type MainPageScreenNavigationProp = DrawerNavigationProp<RootDrawerParamList, 'Main'>;
type NavigationPageScreenNavigationProp = DrawerNavigationProp<RootDrawerParamList, 'Navigation'>;

// Use the defined type for your component
export interface AuthProps {
  navigation: AuthNavigationProp;
}

export interface QuestionnaireProps {
  navigation: QuestionnaireNavigationProp;
}

export interface ProfilePageProps {
  navigation: ProfilePageNavigationProp;
}

export interface TeamsPageScreenProps {
  navigation: TeamsPageNavigationProp;
}

export interface AboutUsPageScreenProps {
  navigation: AboutUsPageScreenNavigationProp;
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
  ForgotPassword: undefined;
  ResetPassword: undefined;
  //ResetPassword: {email_prop: string} | undefined;
  // Add other screens as needed
};

// Create the navigator
export const AuthStack = createStackNavigator<RootStackParamList>();

// Define the type for the navigation prop
type LoginPageNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;
type RegisterPageScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;
type ForgotPasswordPageScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ForgotPassword'>;
type ResetPasswordPageScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ResetPassword'>;



// Use the defined type for your component
export interface LoginPageProps {
  navigation: LoginPageNavigationProp;
}

export interface RegisterPageProps {
  navigation: RegisterPageScreenNavigationProp;
}

export interface ForgotPasswordPageProps {
  navigation: ForgotPasswordPageScreenNavigationProp;
}

export interface ResetPasswordPageProps {
  navigation: ResetPasswordPageScreenNavigationProp;
  //email_prop: string;
}