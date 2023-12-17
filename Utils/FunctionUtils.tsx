import {saveSessionData, removeSessionData} from '../Utils/EncryptedStorageUtility'
import { created, ok, Login, LoginResponse, GetHealth } from '../Utils/WebServerUtils';

export const sessionAuthName = 'user_auth'

interface HandleLoginArguments {
    email: string;
    password: string;
    toggleRememberData: boolean;
    setUser: Function;
    setUserId: Function;
    setIsAuthenticated: Function;
  }

export async function HandleLogin ({email, password, toggleRememberData, setUser, setUserId, setIsAuthenticated}: HandleLoginArguments): Promise<Boolean> {
    const LoginResponse = await Login ({email, password});
      if (LoginResponse.status == created) {
        if (toggleRememberData) {
          await removeSessionData(sessionAuthName);
          saveSessionData(sessionAuthName, {email : email, password : password})
        }
        setUser(email);
        setUserId(LoginResponse.user_id);
        setIsAuthenticated(true);
        return true;
      } else {
        console.log("Something went wrong")
        return false;
      }
  };


  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export async function HealthCheck (): Promise<Boolean> {
  try {
    const response = await GetHealth();
    if (response.response_code == ok) {
      if (response.health_response?.status == 'UP') {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } catch (err) {
    console.log('Error : ' + err);
    return false;
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function FormatDateofBirth (date_of_birth: Date) {
  let day;
  let month;
  if (date_of_birth.getMonth()<10) {
    month = '0' + date_of_birth.getMonth()
  } else { month = date_of_birth.getMonth() }

  if (date_of_birth.getDay()<10) {
      day = '0' + date_of_birth.getDay()
  } else { day = date_of_birth.getDay() }
  return date_of_birth.getFullYear() + '-' + month + '-' + day;
}

export function parseDateString(dateString: string) {
  const [year, month, day] = dateString.split('-').map(Number);
  // Month in JavaScript is 0-based, so we need to subtract 1 from the month
  return new Date(year, month - 1, day);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////