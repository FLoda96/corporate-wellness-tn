import React, {useContext, useEffect, useState} from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import {MainPageScreenProps} from '../Utils/NavigationTypes'
import {UserContext, UserContextType, LoginContext, LoginContextType, UserIdContext, UserIdContextType} from '../Utils/AuthContext'
import {saveSessionData, removeSessionData} from '../Utils/EncryptedStorageUtility'
import { HandleLogin, sessionAuthName } from '../Utils/FunctionUtils';
import { ok, GetRoutePerformanceByUser, RoutePerformance } from '../Utils/WebServerUtils';
import { LoadingScreen } from '../Utils/LoadingScreen';
import { RoutePerformanceTable } from '../Utils/RoutePerformanceTable';
import { styles } from '../Utils/Styles';
import { useTranslation } from 'react-i18next';
import { LanguagePicker } from '../Languages/LanguagePicker'

// TO DO : How to make the table reload every time i return to the page
// TO DO : Move disconnect as a general function in the header or something
export function MainPage({ navigation }: MainPageScreenProps): JSX.Element {
  const [isLoading, setIsLoading] = useState(false);
  const [performanceData, setPerformanceData] = useState<RoutePerformance[] | null>(null);
  const {User, SetUser} = useContext(UserContext) as UserContextType;
  const {UserId, SetUserId} = useContext(UserIdContext) as UserIdContextType;
  const {IsAuthenticated, SetIsAuthenticated} = useContext(LoginContext) as LoginContextType;
  const { t, i18n } = useTranslation();

  const greeting = t('main_page.greeting');
  const disconnect = t('main_page.disconnect')
  const reload_table = t('main_page.reload_table')

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      LoadRoutePerformance();
    };
    // Roundabout way to call the above but async TO DO : search a library that does this
    fetchData();
  }, []);

  async function LoadRoutePerformance () {
    const response = await GetRoutePerformanceByUser({user_id: UserId});
    if (response.response_code == ok) {
      setIsLoading(false);
      setPerformanceData(response.routes)
    } else {
      setIsLoading(false);
      console.log('Something went wrong')
    }
  }

  function Disconnect() {
    removeSessionData(sessionAuthName);
    SetUser('');
    SetIsAuthenticated(false);
  }

    return (
        <View style={styles.navigation}>
              {((performanceData == null) || (performanceData.length === 0)) && (
                <Text style={{ color: 'black', textAlign: 'center', paddingHorizontal: 45, marginBottom: 10, fontSize: 20 }}>
                  {greeting}
                </Text>
              )}
            <LanguagePicker/>
            <Button title={disconnect} onPress={() => Disconnect()} />
            <View style={{marginBottom: 10}}></View>
            <Button title={reload_table} onPress={() => LoadRoutePerformance()} />
            <View style={{marginBottom: 10}}></View>
            {((performanceData != null) && (performanceData[0] != null)) && <RoutePerformanceTable data={performanceData}></RoutePerformanceTable>}
            {isLoading && <LoadingScreen/>}
      </View>
    );
  };
  
  export default MainPage;