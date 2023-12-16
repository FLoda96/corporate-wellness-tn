//export const serverUrl = 'https://192.168.1.124:8443'
export const serverUrl = 'http://192.168.1.124:8090'
export const basicAuth = 'Basic dGVzdDp0ZXN0'
export const ok = 200;
export const created = 201;
export const bad_request = 400;
const profile = '/profile'
const registration = '/registration'
const login = '/login'
const performance = '/routeperformance'

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

interface UpdateUserArguments {
  //user_id: number;
  //company_id: number;
  name: string;
  surname: string;
  email: string;
  nickname: string;
  sex: string;
  height: number;
  weight: number;
  heart_rate: number;
}

export interface UpdateUserArgumentsResponse {
  response_code: number;
}

export async function UpdateUser ({name, surname, nickname, email, sex, height, weight, heart_rate}: UpdateUserArguments): Promise<UpdateUserArgumentsResponse> {
  console.log("Executing UpdateUser");
  try {
    const response = await fetch(serverUrl + profile, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': basicAuth,
      },
      body: JSON.stringify({
        //company_id: company_id,
        name: name,
        surname: surname,
        email: email,
        nickname: nickname,
        sex: sex,
        height: height,
        weight: weight,
        heart_rate: heart_rate,
      }),
    });

    const status = response.status;
    console.log("Status : " + status)
    if (status == ok) {
      const body = await response.json();
      console.log("Body : " + body);
      return {response_code: status}
    } else {
      return {response_code: status}
    }
  } catch (err) {
    console.log(err);
    return {response_code: 0}
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
        hashed_password: password
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
  email: string;
  password: string;
}

export interface LoginResponse {
  status: number;
  user_id: number;
}

export async function Login ({email, password}: LoginArguments): Promise<LoginResponse> {
  console.log("Executing Login");
  try {
    const response = await fetch(serverUrl + login, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        //'Authorization': basicAuth,
      },
      body: JSON.stringify({
        email: email,
        hashed_password: password
      }),
    });

    const status = response.status;
    console.log("Status : " + status);
    
    if (status == created) {
      const user_id = await response.text();
      //console.log("Body : " + user_id);
      return {status: status, user_id: parseInt(user_id)};
    } else {
      return {status: status, user_id: 0};
    }
  } catch (err) {
    console.log(err);
    return {status: 0, user_id: 0};;
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////

interface SearchUserByEmailArguments {
  email: string;
}

export interface SearchUserByEmailResponse {
  user_id: number;
  company_id: number;
  name: string;
  surname: string;
  email: string;
  nickname: string;
  sex: string;
  height: number;
  weight: number;
  heart_rate: number;
}

export async function SearchUserByEmail ({email}: SearchUserByEmailArguments): Promise<SearchUserByEmailResponse | number> {
  console.log("Searching User By Email");
  try {
    const response = await fetch(serverUrl + profile + '/' + email, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': basicAuth,
      },
    });

    const status = response.status;
    console.log("Status : " + status);
    
    if (status == ok) {
      const body = await response.json();
      console.log("Body : " + body);
      return body;
    } else {
      return 0;
    }
  } catch (err) {
    console.log(err);
    return 0;
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////

interface SavePerformanceArguments {
  route_id: number;
  user_id: number;
  timestamp_start: string;
  heart_rate_start: number;
}

export interface SavePerformanceResponse {
  response_code: number;
  performance_id: number;
}

export async function SavePerformance ({route_id, user_id, timestamp_start, heart_rate_start}: SavePerformanceArguments): Promise<SavePerformanceResponse> {
  console.log("Executing SavePerfromance");
  try {
    const response = await fetch(serverUrl + performance, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        //'Authorization': basicAuth,
      },
      body: JSON.stringify({
        route_id: route_id,
        user_id: user_id,
        timestamp_start: timestamp_start,
        heart_rate_start: heart_rate_start
      }),
    });

    const status = response.status;
    console.log("Status : " + status)
    if (status == created) {
      const body = await response.json();
      console.log("Body : " + body);
      return {response_code: status, performance_id: body.performance_id}
    } else {
      return {response_code: status, performance_id: 0}
    }
  } catch (err) {
    console.log(err);
    return {response_code: 0, performance_id: 0}
  }
}

interface UpdatePerformanceArguments {
  performance_id: number;
  timestamp_end: string;
  heart_rate_end: number;
}

export interface UpdatePerformanceResponse {
  response_code: number;
}

export async function UpdatePerformance ({performance_id, timestamp_end, heart_rate_end}: UpdatePerformanceArguments): Promise<UpdatePerformanceResponse> {
  console.log("Executing UpdatePerfromance");
  try {
    const response = await fetch(serverUrl + performance + '/' + performance_id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        //'Authorization': basicAuth,
      },
      body: JSON.stringify({
        timestamp_end: timestamp_end,
        heart_rate_end: heart_rate_end
      }),
    });

    const status = response.status;
    console.log("Status : " + status)
    if (status == ok) {
      const body = await response.text();
      console.log("Body : " + body);
      return {response_code: status}
    } else {
      return {response_code: status}
    }
  } catch (err) {
    console.log(err);
    return {response_code: 0}
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////