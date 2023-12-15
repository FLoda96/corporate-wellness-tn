import {saveSessionData, removeSessionData} from '../Utils/EncryptedStorageUtility'
import { created, Login } from '../Utils/WebServerUtils';

export const sessionAuthName = 'user_auth'

interface HandleLoginArguments {
    email: string;
    password: string;
    toggleRememberData: boolean;
    setUser: Function;
    setIsAuthenticated: Function;
  }

export async function HandleLogin ({email, password, toggleRememberData, setUser, setIsAuthenticated}: HandleLoginArguments) {
    const LoginResponse = await Login ({email, password});
      if (LoginResponse == created) {
        if (toggleRememberData) {
          await removeSessionData(sessionAuthName);
          saveSessionData(sessionAuthName, {email : email, password : password})
        }
        setUser(email);
        setIsAuthenticated(true);
      } else {
        console.log("Something went wrong")
      }
  };