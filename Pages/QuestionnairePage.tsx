import React, {useContext, useEffect, useState, useRef} from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert } from 'react-native';
import {QuestionnaireProps} from '../Utils/NavigationTypes'
import {UserContext, UserContextType, LoginContext, LoginContextType, UserIdContext, UserIdContextType} from '../Utils/AuthContext'
import {saveSessionData, removeSessionData} from '../Utils/EncryptedStorageUtility'
import { HandleLogin, sessionAuthName, sessionLanguage } from '../Utils/FunctionUtils';
import { ok, no_content, bad_request, created, GetQuestionList, QuestionData, SaveAnswersQuestionnaire, Answer } from '../Utils/WebServerUtils';
import { LoadingScreen } from '../Utils/LoadingScreen';
import { styles } from '../Utils/Styles'
import { useTranslation } from 'react-i18next';
import { QuestionList } from '../Utils/QuestionList'
import { retrieveSessionData } from '../Utils/EncryptedStorageUtility'

// TO DO : Test extensively, this can have a lot of pitfall and race condition in all the data handling
// TO DO : Scroll down menu to select questionnaire type via name instead of hardcoded
export function QuestionnairePage({ navigation }: QuestionnaireProps): JSX.Element {
  const [isLoading, setIsLoading] = useState(false);
  const [questionData, setQuestionData] = useState<QuestionData[] | null>(null);
  const { t, i18n } = useTranslation();
  const answerList = useRef<Answer[]>([])
  const questionnaire_id = 1;
  const language_code = useRef('IT');
  const {UserId, SetUserId} = useContext(UserIdContext) as UserIdContextType;

  const reload_table = t('question_page.reload_table');
  const send_answer_button = t('question_page.send_answer_button');
  
  const sumbit_notice = t('alerts.sumbit_notice');
  const submit_alert = t('alerts.submit_alert');

  useEffect(() => {
    const fetchData = async () => {
      InitializePage();
    };
    // Roundabout way to call the above but async TO DO : search a library that does this
    fetchData();
  }, []);

  async function InitializePage() {
    await GetLanguage();
    LoadQuestionData();
  }

  async function GetLanguage () {
    const sessionLanguagePreference = await retrieveSessionData(sessionLanguage);
    if (sessionLanguagePreference !== undefined) {
      const parsedSessionLanguage = JSON.parse(sessionLanguagePreference);
      if (parsedSessionLanguage.language !== null) {
        console.log('Language ' + parsedSessionLanguage.language);
      } else {
        language_code.current = 'IT';
      }
    }
  }

  async function LoadQuestionData () {
    setIsLoading(true);
    const response = await GetQuestionList({questionnaire_id: questionnaire_id, language_code: language_code.current});
    if (response.response_code == ok) {
      if ((response.question_data != null) && (response.question_data[0] != null)) {
        await InitializeAnswerList(response.question_data);
        setIsLoading(false);
        setQuestionData(response.question_data);
      }
      if ((questionData != null) && (questionData[0] != null)) {
        console.log("question_id : " + questionData[0].question_id);
        console.log("question_id : " + questionData[1].question_id);
        console.log("question_id : " + questionData[2].question_id);
        console.log("question_id : " + questionData[3].question_id);
        console.log("question_id : " + questionData[4].question_id);
      }
    } else {
      setIsLoading(false);
      console.log('Something went wrong GetQuestionList')
    }
  }

  async function InitializeAnswerList (question_data_response: QuestionData[]) {
      answerList.current = [];
      for (const question of question_data_response) {
        let answer: Answer = {
          user_id: UserId,
          questionnaire_id: questionnaire_id,
          question_id: question.question_id,
          answer_type: question.question_type,
          language_code: language_code.current,
          answer_numeric: 0,
          answer: '',
          timestamp_answer: ''
        }
        answerList.current.push(answer);
      }
  }
    
  // TO DO : Check that all the obligatory answers are answered
  // TO DO : Add an alert before sending the answers
  async function SubmitQuestionnaireAnswers () {
    setIsLoading(true);
    const response = await SaveAnswersQuestionnaire({answer_list : answerList.current});
    if (response == created) {
      setIsLoading(false);
      //setQuestionData(response.question_data)
    } else {
      setIsLoading(false);
      console.log('Something went wrong GetQuestionList')
    }
  }

    return (
        <View style={styles.navigation}>
            <View style={{marginBottom: 10}}></View>
            <Button title={reload_table} onPress={() => InitializePage()} />

            {((questionData != null) && (questionData[0] != null)) && 
            <>
                <QuestionList questionData={questionData} answersList={answerList.current}/>
                <Button title={send_answer_button} onPress={() => SubmitQuestionnaireAnswers()} />
            </>
            }
            {isLoading && <LoadingScreen/>}
      </View>
    );
    
    // TO DO : Actually use alert
    function showSubmitAlert () {
      Alert.alert(
      sumbit_notice,
      submit_alert,
      [{ text: 'Ok', style: 'default',}]);
  }
  };
  
  export default QuestionnairePage;

