// TeamList.js

import React, {useContext, useEffect, useState, useRef} from 'react';
import { FlatList, View, Text, Image, StyleSheet, ScrollView, Button, Alert, TextInput } from 'react-native';
import {UserContext, UserContextType, LoginContext, LoginContextType, UserIdContext, UserIdContextType} from './AuthContext'
import { QuestionData, Answer } from './WebServerUtils';
import { useTranslation } from 'react-i18next';
import { styles as styles_import } from './Styles'


interface QuestionListProps {
    questionData: QuestionData[];
    answersList: Answer[];
  }

// TO DO : add a max in the text of the answer to match the db field
// TO DO : add a notice if an answer is obligatory
export function QuestionList({questionData, answersList}: QuestionListProps): JSX.Element {
  const { t, i18n } = useTranslation();
  const {UserId, SetUserId} = useContext(UserIdContext) as UserIdContextType;
  const [answers, setAnswers] = useState<string[]>([]);
  const text = 'text';
  const numeric = 'numeric'

  const question = t('question_list.question');

  // Could be excessively slow since every time something is typed a lot is updated; Lol, react logs confirmed this
  // Does it even work to update answersList like this ?
  const handleAnswerChange = (index: number, newAnswer: string, answer_type: string) => {
    //console.log('index ' + index);
    //console.log('newAnswer ' + newAnswer);
    //console.log('answer_type ' + answer_type);
    const newAnswers = [...answers];
    newAnswers[index] = newAnswer;
    // Update answerList
    if (answer_type == text) {
      const answerListIndex = getIndexByQuestionId(index);
      answersList[answerListIndex].answer = newAnswer;
    }
    if (answer_type == numeric) {
      const answerListIndex = getIndexByQuestionId(index);
      answersList[answerListIndex].answer_numeric = parseInt(newAnswer);
    }
    setAnswers(newAnswers);
  };

  function getIndexByQuestionId (question_id: number) {
    for (let i = 0; i < answersList.length; i++) {
      if (answersList[i].question_id == question_id) {
        return i;
      }
    }
    return -1;
  }

  const renderItem = ({ item }: { item: QuestionData }) => (
    <ScrollView style={styles.Edges}>
      <View>
        <Text style={styles.question_header}>{question + item.question_order + ")"}</Text>
        <Text style={styles.question}>{item.question_text}</Text>
        {
          item.question_type == text ? 
            (<AnswerInput value={answers[item.question_id]} onChangeText={(text) => handleAnswerChange(item.question_id, text, item.question_type)}/>) 
            : 
            // TO DO : Should be answerDial but let's first stabilize the page update
            (<AnswerInput value={answers[item.question_id]} onChangeText={(text) => handleAnswerChange(item.question_id, text, item.question_type)}/>)
        }
      </View>
    </ScrollView>
  );

  return (
    <FlatList
      data={questionData}
      keyExtractor={(item) => item.question_id.toString()}
      renderItem={renderItem}
    />
  );
};

const styles = StyleSheet.create({
  Edges: {
      paddingRight: 15,
      paddingLetf: 5
  },
  teamContainer: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  logo: {
    width: 70,
    height: 70,
    marginRight: 16,
    borderRadius: 25,
  },
  teamInfo: {
  },
  question: {
    color : 'black',
  },
  question_header: {
    color : 'black',
    fontWeight: 'bold',
  },
  description: {
    marginTop: 4,
    color: '#555',
  },
});

export default QuestionList;

interface AnswerProps {

}

interface AnswerProps {
  value: string;
  onChangeText: (text: string) => void;
}

function AnswerInput({ value, onChangeText }: AnswerProps): JSX.Element {
  return <TextInput style={styles_import.input} value={value} onChangeText={onChangeText} />;
}

interface AnswerDialProps {

}

function AnswerDial({}: AnswerDialProps): JSX.Element {
  const [answer, setAnswer] = useState<string>('');
  return (
    <TextInput style={styles_import.input} value={answer} keyboardType="numeric" onChangeText={(text) => setAnswer(text)} />
  )
}