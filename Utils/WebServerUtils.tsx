//export const serverUrl = 'https://192.168.1.124:8443'
export const serverUrl = 'http://192.168.1.124:8090'
export const basicAuth = 'Basic dGVzdDp0ZXN0'
export const created = 201;
export const bad_request = 400;
const profile = '/profile'
const registration = '/registration'
const login = '/login'

// TO DO : Remove the various logs
/////////////////////////////////////////////////////////////////////////////////////////////////

interface RegisterUserArguments {
    company: number;
    email: string;
    username: string;
  }

export interface RegisterUserArgumentsResponse {
  response_code: number;
  user_id: number;
  email: string;
}

export async function RegisterUser ({company, email, username}: RegisterUserArguments): Promise<RegisterUserArgumentsResponse> {
  console.log("Executing RegisterUser");
  try {
    const response = await fetch(serverUrl + profile, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': basicAuth,
      },
      body: JSON.stringify({
        company_id: company,
        email: email,
        nickname: username
      }),
    });

    const status = response.status;
    console.log("Status : " + status)
    if (status == created) {
      const body = await response.json();
      console.log("Body : " + body);
      return {response_code: status, user_id: body.user_id, email: body.email}
    } else {
      // TO DO : Consider the posssibility of a 400 but not because the email is already in use
      return {response_code: status, user_id: 0, email: ''}
    }
  } catch (err) {
    console.log(err);
    return {response_code: 0, user_id: 0, email: ''}
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////

interface RegisterAuthArguments {
  user_id: number;
  email: string;
  password: string;
}

export async function RegisterAuth ({user_id, email, password}: RegisterAuthArguments): Promise<number> {
  console.log("Executing RegisterAuth");
  console.log("user_id " + user_id + ", email " + email + ", password " + password);
  // TO DO : Create an actual algorithm for the salt
  const salt = "salt";
  
  try {
    const response = await fetch(serverUrl + registration, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        //'Authorization': basicAuth,
      },
      body: JSON.stringify({
        user_id: user_id,
        email: email,
        hashed_password: password,
        salt: salt
      }),
    });

    const status = response.status;
    console.log("Status : " + status);
    
    if (status == created) {
      const body = await response.json();
      console.log("Body : " + body);
      return status;
    } else {
      return status;
    }
  } catch (err) {
    console.log(err);
    return 0;
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////

interface LoginArguments {
  user_id: number;
  email: string;
  password: string;
}

export async function Login ({user_id, email, password}: LoginArguments): Promise<number> {
  console.log("Executing Login");
  try {
    const response = await fetch(serverUrl + login, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        //'Authorization': basicAuth,
      },
      body: JSON.stringify({
        user_id: user_id,
        email: email,
        hashed_password: password
      }),
    });

    const status = response.status;
    console.log("Status : " + status);
    
    if (status == created) {
      const body = await response.text();
      console.log("Body : " + body);
      return status;
    } else {
      return status;
    }
  } catch (err) {
    console.log(err);
    return 0;
  }
}