import { Timestamp } from "react-native-reanimated/lib/typescript/reanimated2/commonTypes";

//export const serverUrl = 'https://192.168.1.124:8443'
export const serverUrl = 'http://192.168.1.124:8090'

//export const serverUrl = 'https://192.168.131.160:8443'
export const basicAuth = 'Basic dGVzdDp0ZXN0'

export const ok = 200;
export const created = 201;
export const bad_request = 400;
export const no_content = 204;
const profile = '/profile'
const registration = '/registration'
const login = '/login'
const performance = '/routeperformance'
const user = '/user'
const routes = '/route/all'
const health = '/q/health/ready'
const teamAll = '/team/all'
const teamMember = '/teammember'
const teamMembersTeam = '/teammember/team'
const teamJoined = '/teammember/user'
const forgotpassword = '/forgotpassword'
const checkvalidity = '/checkvalidity'
const questionnaire = '/questionnaire'
const questionlist = '/questionlist'
const answer = '/answer'
const list = '/list'
const company = '/company'
const lastanswer = '/lastanswer'

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
  date_of_birth: string;
  email: string;
  nickname: string;
  sex: string;
  waistline: number;
  height: number;
  weight: number;
  heart_rate: number;
  step_length: number;
}

export interface UpdateUserArgumentsResponse {
  response_code: number;
}

export async function UpdateUser ({name, surname, date_of_birth, nickname, email, sex, waistline, height, weight, heart_rate, step_length}: UpdateUserArguments): Promise<UpdateUserArgumentsResponse> {
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
        date_of_birth: date_of_birth,
        email: email,
        nickname: nickname,
        sex: sex,
        waistline: waistline,
        height: height,
        weight: weight,
        heart_rate: heart_rate,
        step_length: step_length,
      }),
    });

    const status = response.status;
    console.log("Status : " + status)
    if (status == ok) {
      const body = await response.json();
      
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
  
  try {
    const response = await fetch(serverUrl + registration, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': basicAuth,
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

interface UpdateAuthArguments {
  email: string;
  password: string;
}

export async function UpdateAuth ({email, password}: UpdateAuthArguments): Promise<number> {
  console.log("Executing UpdateAuth");

  try {
    const response = await fetch(serverUrl + registration, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': basicAuth,
      },
      body: JSON.stringify({
        email: email,
        hashed_password: password
      }),
    });

    const status = response.status;
    console.log("Status : " + status);
    
    if (status == ok) {
      const body = await response.json();
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
        'Authorization': basicAuth,
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
  date_of_birth: string;
  email: string;
  nickname: string;
  sex: string;
  waistline: number;
  height: number;
  weight: number;
  heart_rate: number;
  step_length: number;
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
  timestamp_end: string;
  heart_rate_end: number;
}

export interface SavePerformanceResponse {
  response_code: number;
  performance_id: number;
}

export async function SavePerformance ({route_id, user_id, timestamp_start, heart_rate_start, timestamp_end, heart_rate_end}: SavePerformanceArguments): Promise<SavePerformanceResponse> {
  console.log("Executing SavePerfromance");
  try {
    const response = await fetch(serverUrl + performance, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': basicAuth,
      },
      body: JSON.stringify({
        route_id: route_id,
        user_id: user_id,
        timestamp_start: timestamp_start,
        heart_rate_start: heart_rate_start,
        timestamp_end: timestamp_end,
        heart_rate_end: heart_rate_end
      }),
    });

    const status = response.status;
    console.log("Status : " + status)
    if (status == created) {
      const body = await response.json();
      
      return {response_code: status, performance_id: body.performance_id}
    } else {
      return {response_code: status, performance_id: 0}
    }
  } catch (err) {
    console.log(err);
    return {response_code: 0, performance_id: 0}
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////

interface GetRoutePerformanceByUserArguments {
  user_id: number;
}

export interface GetRoutePerformanceByUserResponse {
  response_code: number;
  routes: RoutePerformance[] | null;
}

export interface RoutePerformance {
  performance_id: number;
  route_id: number;
  user_id: number;
  timestamp_start: string;
  heart_rate_start: number;
  timestamp_end: string;
  heart_rate_end: number;
}

export async function GetRoutePerformanceByUser ({user_id}: GetRoutePerformanceByUserArguments): Promise<GetRoutePerformanceByUserResponse> {
  console.log("Executing UpdatePerfromance");
  try {
    const response = await fetch(serverUrl + performance + user +'/' + user_id, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': basicAuth,
      },
    });

    const status = response.status;
    console.log("Status : " + status)
    if (status == ok) {
      const body = await response.json();
      
      return {response_code: status, routes: body}
    } else {
      return {response_code: status, routes: null}
    }
  } catch (err) {
    console.log(err);
    return {response_code: 0, routes: null}
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////

export interface Routes {
  route_id: number;
  company_id: number;
  name: string;
  description: number;
}

export interface RoutesResponse {
  response_code: number;
  routes: Routes[] | null;
}

export async function GetRoutes (): Promise<RoutesResponse> {
  console.log("Executing GetRoutes");
  try {
    const response = await fetch(serverUrl + routes, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': basicAuth,
      },
    });

    const status = response.status;
    console.log("Status : " + status)
    if (status == ok) {
      const body = await response.json();
      
      return {response_code: status, routes: body}
    } else {
      return {response_code: status, routes: null}
    }
  } catch (err) {
    console.log(err);
    return {response_code: 0, routes: null}
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////

export interface HealthResponseFormat {
  status: string;
  checks: Check[];
}

export interface Check {
  name: string;
  status: string;
  data: string[];
}

export interface HealthResponse {
  response_code: number;
  health_response: HealthResponseFormat | null;
}

export async function GetHealth (): Promise<HealthResponse> {
  console.log("Executing GetHealth");
  try {
    const response = await fetch(serverUrl + health, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': basicAuth,
      },
    });

    const status = response.status;
    console.log("Status : " + status)
    if (status == ok) {
      const body = await response.json();
      
      return {response_code: status, health_response: body}
    } else {
      return {response_code: status, health_response: null}
    }
  } catch (err) {
    console.log(err);
    return {response_code: 0, health_response: null}
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface Team {
  team_id: number;
  name: string;
  description: string;
  logo_link: string;
}

export interface TeamResponse {
  response_code: number;
  teams: Team[] | null;
}

export async function GetTeams (): Promise<TeamResponse> {
  console.log("Executing GetTeams");
  try {
    const response = await fetch(serverUrl + teamAll, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': basicAuth,
      },
    });

    const status = response.status;
    console.log("Status : " + status)
    if (status == ok) {
      const body = await response.json();
      
      return {response_code: status, teams: body}
    } else {
      return {response_code: status, teams: null}
    }
  } catch (err) {
    console.log(err);
    return {response_code: 0, teams: null}
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface TeamMembers {
  teammember_id: number;
  team_id: number;
  user_id: number;
}

export interface TeamMembersResponse {
  response_code: number;
  team_members: TeamMembers[] | null;
}

export interface GetTeamMembersArguments {
  teamId: number;
}


export async function GetTeamMembers ({teamId}: GetTeamMembersArguments): Promise<TeamMembersResponse> {
  console.log("Executing GetTeamMembers");
  try {
    const response = await fetch(serverUrl + teamMembersTeam + '/' + teamId, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': basicAuth,
      },
    });

    const status = response.status;
    console.log("Status : " + status)
    if (status == ok || status == no_content) {
      const body = await response.json();
      
      return {response_code: status, team_members: body}
    } else {
      return {response_code: status, team_members: null}
    }
  } catch (err) {
    console.log(err);
    return {response_code: 0, team_members: null}
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface TeamJoinedResponse {
  response_code: number;
  team_members: TeamMembers[] | null;
}

export interface GetTeamJoinedArguments {
  user_id: number;
}


export async function GetTeamJoined ({user_id}: GetTeamJoinedArguments): Promise<TeamMembersResponse> {
  console.log("Executing GetTeamMembers");
  try {
    const response = await fetch(serverUrl + teamJoined + '/' + user_id, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': basicAuth,
      },
    });

    const status = response.status;
    console.log("Status GetTeamJoined : " + status)
    if (status == ok || status == no_content) {
      const body = await response.json();
      return {response_code: status, team_members: body}
    } else {
      return {response_code: status, team_members: null}
    }
  } catch (err) {
    console.log(err);
    return {response_code: 0, team_members: null}
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface JoinTeamArguments {
  user_id: number;
  team_id: number
}


export async function JoinTeam ({user_id, team_id}: JoinTeamArguments): Promise<number> {
  console.log("Executing JoinTeam");
  try {
    const response = await fetch(serverUrl + teamMember, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': basicAuth,
      },
      body: JSON.stringify({
        user_id: user_id,
        team_id: team_id,
      }),
    });

    const status = response.status;
    console.log("Status JoinTeam : " + status)
    if (status == created) {
      const body = await response.json();
      return status;
    } else {
      return status;
    }
  } catch (err) {
    console.log(err);
    return 0;
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface LeaveTeamArguments {
  user_id: number;
  team_id: number
}


export async function LeaveTeam ({user_id, team_id}: LeaveTeamArguments): Promise<number> {
  console.log("Executing LeaveTeam");
  try {
    const response = await fetch(serverUrl + teamMember, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': basicAuth,
      },
      body: JSON.stringify({
        user_id: user_id,
        team_id: team_id,
      }),
    });

    const status = response.status;
    console.log("Status LeaveTeam : " + status)
    if (status == no_content) {
      const body = await response.text();
      return status;
    } else {
      return status;
    }
  } catch (err) {
    console.log(err);
    return 0;
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface SendForgotPasswordEmailArguments {
  email: string;
  timestamp_request: string;
}

export async function SendForgotPasswordEmail ({email, timestamp_request}: SendForgotPasswordEmailArguments): Promise<number> {
  console.log("Executing SendForgotPasswordEmail");
  try {
    const response = await fetch(serverUrl + forgotpassword, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': basicAuth,
      },
      body: JSON.stringify({
        email: email,
        timestamp_request: timestamp_request,
      }),
    });
    console.log(JSON.stringify({
      email: email,
      timestamp_now: timestamp_request,
    }),)
    const status = response.status;
    console.log("Status SendForgotPasswordEmail : " + status)
    if (status == created) {
      const body = await response.json();
      return status;
    } else {
      return status;
    }
  } catch (err) {
    console.log(err);
    return 0;
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface CheckMailForgetPasswordArguments {
  email: string;
  code: string;
}

export async function CheckMailForgetPassword ({email, code}: CheckMailForgetPasswordArguments): Promise<number> {
  console.log("Executing CheckMailForgetPassword");
  console.log("Mail : " + email);

  try {
    const response = await fetch(serverUrl + forgotpassword + checkvalidity, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': basicAuth,
      },
      body: JSON.stringify({
        email: email,
        unique_code: code
      }),
    });

    const status = response.status;
    console.log("Status : " + status);
    
    if (status == ok) {
      const body = await response.text();
      return status;
    } else {
      return status;
    }
  } catch (err) {
    console.log(err);
    return 0;
  }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface Questionnaire {
  questionnaire_id: number;
  company_id: number;
}
export interface QuestionnaireData {
  questionnaire_data_id: number;
  questionnaire_id: number;
  language_code: string;
  title: string;
  description: string;
}
export interface Question {
  question_id: number;
  questionnaire_id: number;
}

export interface QuestionData {
  question_data_id: number;
  question_id: number;
  language_code: string;
  question_text: string;
  question_type: string;
  obligatory: boolean;
  question_order: number;
}

export interface Answer {
  //answer_id: number;
  user_id: number;
  questionnaire_id: number;
  question_id: number;
  answer_type: string;
  language_code: string;
  answer_numeric: number;
  answer: string;
  timestamp_answer: string;
}

export interface GetQuestionnaireListResponse {
  response_code: number;
  questionnaire_data: QuestionnaireData[] | null;
}

export interface GetQuestionnaireListArguments {
  company_id: number;
  language_code: string;
}

export async function GetQuestionnaireList({company_id, language_code}: GetQuestionnaireListArguments): Promise<GetQuestionnaireListResponse> {
  console.log("Executing GetQuestionnaireList");
  try {
    const response = await fetch(serverUrl + questionnaire + company + '/' + company_id + '/' + language_code, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': basicAuth,
      },
    });

    const status = response.status;
    console.log("Status GetQuestionnaireList : " + status)
    if (status == ok) {
      const body = await response.json();
      return {response_code: status, questionnaire_data: body}
    } else {
      return {response_code: status, questionnaire_data: null}
    }
  } catch (err) {
    console.log(err);
    return {response_code: 0, questionnaire_data: null}
  }
}

export interface GetQuestionListResponse {
  response_code: number;
  question_data: QuestionData[] | null;
}

export interface GetQuestionListArguments {
  questionnaire_id: number;
  language_code: string;
}

export async function GetQuestionList({questionnaire_id, language_code}: GetQuestionListArguments): Promise<GetQuestionListResponse> {
  console.log("Executing GetQuestionList");
  try {
    const response = await fetch(serverUrl + questionnaire + questionlist + '/' + questionnaire_id + '/' + language_code, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': basicAuth,
      },
    });

    const status = response.status;
    console.log("Status GetQuestionList : " + status)
    if (status == ok) {
      const body = await response.json();
      return {response_code: status, question_data: body}
    } else {
      return {response_code: status, question_data: null}
    }
  } catch (err) {
    console.log(err);
    return {response_code: 0, question_data: null}
  }
}

export interface SaveAnswersQuestionnaireArguments {
  answer_list: Answer[];
}

export async function SaveAnswersQuestionnaire({answer_list}: SaveAnswersQuestionnaireArguments): Promise<number> {
  console.log("Executing SaveAnswersQuestionnaire");
  // insert timestamp
  for (const question of answer_list) {
    question.timestamp_answer = Date.now().toString();
  }

  try {
    const response = await fetch(serverUrl + answer + list, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': basicAuth,
      },
      body: JSON.stringify(answer_list),
    });

    const status = response.status;
    console.log("Status : " + status);
    
    if (status == created) {
      const body = await response.text();
      return status;
    } else {
      return status;
    }
  } catch (err) {
    console.log(err);
    return 0;
  }
}

export interface GetLastAnswerResponse {
  response_code: number;
  last_answer: Answer | null;
}

export interface GetLastAnswerArguments {
  questionnaire_id: number;
  user_id: number;
}

export async function GetLastAnswer({questionnaire_id, user_id}: GetLastAnswerArguments): Promise<GetLastAnswerResponse> {
  console.log("Executing GetLastAnswer");
  try {
    const response = await fetch(serverUrl + answer + lastanswer + '/' + user_id + '/' + questionnaire_id , {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': basicAuth,
      },
    });

    const status = response.status;
    console.log("Status GetLastAnswer : " + status);
    if (status == ok) {
      const body = await response.json();
      return {response_code: status, last_answer: body}
    } else {
      return {response_code: status, last_answer: null}
    }
  } catch (err) {
    console.log(err);
    return {response_code: 0, last_answer: null}
  }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////