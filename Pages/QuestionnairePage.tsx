import React, {useContext, useEffect, useState, useRef} from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert } from 'react-native';
import {QuestionnaireProps} from '../Utils/NavigationTypes'
import {UserContext, UserContextType, LoginContext, LoginContextType, UserIdContext, UserIdContextType} from '../Utils/AuthContext'
import {saveSessionData, removeSessionData} from '../Utils/EncryptedStorageUtility'
import { HandleLogin, sessionAuthName, sessionLanguage } from '../Utils/FunctionUtils';
import { ok, no_content, bad_request, created, GetQuestionList, QuestionData, SaveAnswersQuestionnaire, Answer, GetQuestionnaireList, QuestionnaireData, GetLastAnswer } from '../Utils/WebServerUtils';
import { LoadingScreen } from '../Utils/LoadingScreen';
import { styles } from '../Utils/Styles'
import { useTranslation } from 'react-i18next';
import { QuestionList } from '../Utils/QuestionList'
import { retrieveSessionData } from '../Utils/EncryptedStorageUtility'
import DropDownPicker from 'react-native-dropdown-picker';

// TO DO : Test extensively, this can have a lot of pitfall and race condition in all the data handling
export function QuestionnairePage({ navigation }: QuestionnaireProps): JSX.Element {
  const [isLoading, setIsLoading] = useState(false);
  const [questionData, setQuestionData] = useState<QuestionData[] | null>(null);
  const [questionnaireData, setquestionnaireData] = useState<QuestionnaireData[] | null>(null);

  const { t, i18n } = useTranslation();
  const answerList = useRef<Answer[]>([])
  //const questionnaire_id = 1;
  const company_id = useRef(1);
  const language_code = useRef('IT');
  const last_time_taken = useRef('');
  const {UserId, SetUserId} = useContext(UserIdContext) as UserIdContextType;

  const [openDropdown, setOpenDropdown] = useState(false);
  const [valueDropdown, setValueDropdown] = useState(null);
  interface LabelValue {
    label: string;
    value: number;
  }
  const [itemsDropdown, setItemsDropdown] = useState<LabelValue[]>([]);

  const reload_table = t('question_page.reload_table');
  const load_questionnaire = t('question_page.load_questionnaire');
  const send_answer_button = t('question_page.send_answer_button');
  const last_time_taken_label = t('question_page.last_time_taken_label');
  const last_time_taken_label_never = t('question_page.last_time_taken_label_never');
  
  const sumbit_notice = t('alerts.sumbit_notice');
  const submit_alert = t('alerts.submit_alert');
  const ok_alert = t('question_page.ok_alert');
  const cancel_alert = t('question_page.cancel_alert');

  useEffect(() => {
    const fetchData = async () => {
      InitializePage();
    };
    // Roundabout way to call the above but async TO DO : search a library that does this
    fetchData();
  }, []);

  async function InitializePage() {
    await GetLanguage();
    LoadQuestionnaires();
  }

  async function GetLanguage () {
    const sessionLanguagePreference = await retrieveSessionData(sessionLanguage);
    if (sessionLanguagePreference !== undefined) {
      const parsedSessionLanguage = JSON.parse(sessionLanguagePreference);
      if (parsedSessionLanguage.language !== null) {
        language_code.current = parsedSessionLanguage.language.toUpperCase();
      } else {
        language_code.current = 'IT';
      }
    }
  }

  async function LoadQuestionnaires () {
    setIsLoading(true);
    const response = await GetQuestionnaireList({company_id: company_id.current, language_code: language_code.current});
    if (response.response_code == ok) {
      if ((response.questionnaire_data != null) && (response.questionnaire_data[0] != null)) {
        setquestionnaireData(response.questionnaire_data);
        createDropdownList(response.questionnaire_data);
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
      console.log('Something went wrong GetQuestionnaireList')
    }
  }

  async function DetermineLastAnswer () {
    if (valueDropdown != null) {
      const response = await GetLastAnswer({questionnaire_id: valueDropdown, user_id: UserId});
      if (response.response_code == ok) {
        last_time_taken.current = last_time_taken_label + response.last_answer?.timestamp_answer.substring(0,10);
      } else {
        last_time_taken.current = last_time_taken_label_never;
      }
  }
}

  function createDropdownList (data: QuestionnaireData[]) {
    if ((data != null) && (data[0] != null)) {
      const NewItemsDropdown = [];
      for (const questionnaireData_element of data) {
        const newItemDropdown: LabelValue = {label: questionnaireData_element.title, value: questionnaireData_element.questionnaire_id};
        NewItemsDropdown.push(newItemDropdown);
      }
      setItemsDropdown(NewItemsDropdown);
  }
  }


  async function LoadQuestionData () {
    if (valueDropdown != null) {
      DetermineLastAnswer();
      setQuestionData([]);
      setIsLoading(true);
      if ((questionnaireData != null) && (questionnaireData[0] != null)) {
      const response = await GetQuestionList({questionnaire_id: valueDropdown, language_code: language_code.current});
      if (response.response_code == ok) {
        if ((response.question_data != null) && (response.question_data[0] != null)) {
          await InitializeAnswerList(response.question_data);
          setIsLoading(false);
          setQuestionData(response.question_data);
        }
      } else {
        setIsLoading(false);
        console.log('Something went wrong GetQuestionList')
      }
    } else {
      setIsLoading(false);
    }
  }
  }

  async function InitializeAnswerList (question_data_response: QuestionData[]) {
    if (valueDropdown != null) {
      answerList.current = [];
      if (itemsDropdown != null && itemsDropdown[0] != null) {
      for (const question of question_data_response) {
        let answer: Answer = {
          user_id: UserId,
          questionnaire_id: valueDropdown,
          question_id: question.question_id,
          answer_type: question.question_type,
          language_code: language_code.current,
          answer_numeric: 50, // Because if they never move the dial that's the default value
          answer: '',
          timestamp_answer: ''
        }
        answerList.current.push(answer);
      }
    }
  }
  }
    
  // TO DO : Check that all the obligatory answers are answered
  async function PressButtonSubmitAnswer () {
    Alert.alert(
      sumbit_notice,
      submit_alert,
      [
        {
          text: cancel_alert,
          style: 'cancel',
          onPress: () => {
            console.log('Cancel pressed');
          },
        },
        {
          text: ok_alert,
          style: 'default',
          onPress: () => {
            SubmitQuestionnaireAnswers();
          },
        },
      ]
    );
  }

  async function SubmitQuestionnaireAnswers () {
    setIsLoading(true);
    const response = await SaveAnswersQuestionnaire({answer_list : answerList.current});
    if (response == created) {
      setIsLoading(false);
    } else {
      setIsLoading(false);
      console.log('Something went wrong GetQuestionList')
    }
  }

  // <View style={{marginBottom: 10}}></View>
  // <Button title={reload_table} onPress={() => InitializePage()} />

    return (
        <View style={styles.navigation}>
            <View style={{marginBottom: 10}}></View>
            <DropDownPicker
                open={openDropdown}
                value={valueDropdown}
                items={itemsDropdown}
                setOpen={setOpenDropdown}
                setValue={setValueDropdown}
                setItems={setItemsDropdown}
            />
            <View style={{marginBottom: 10}}></View>
            <Button title={load_questionnaire} onPress={() => LoadQuestionData()} />
            <View style={{marginBottom: 10}}></View>  

            {((questionData != null) && (questionData[0] != null)) && 
            <>
                <Text style={styles.label}>{last_time_taken.current}</Text>
                <View style={{marginBottom: 10}}></View>
                <QuestionList questionData={questionData} answersList={answerList.current}/>
                <Button title={send_answer_button} onPress={() => PressButtonSubmitAnswer()} />
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

