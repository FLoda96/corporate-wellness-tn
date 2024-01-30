import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, ScrollView, TextInput, Button, StyleSheet, Text, Alert } from 'react-native';
import {NavigationPageScreenProps} from '../Utils/NavigationTypes'
import { Camera, CameraDevice, useCameraDevice, useCameraPermission, useCodeScanner, Code } from "react-native-vision-camera"
// import {showPermissionAlert, showDeviceAlert, showHearthRateMissingAlert, showSaveHearthRateMissingAlert} from '../Utils/Alert'
import {Stopwatch} from '../Utils/Stopwatch'
//import {StepCounter} from '../Utils/StepCounter'
import {Sensors} from '../Utils/Sensors'
import { UserIdContext, UserIdContextType } from '../Utils/AuthContext'
import { ok, created, SavePerformance, SavePerformanceResponse } from '../Utils/WebServerUtils'
import { styles } from '../Utils/Styles'
import { useTranslation } from 'react-i18next';

// TO DO : Any kind of limitations on result accepted ? like less than 3 minutes it's a no or so ?
// TO DO : Open a notification when the user is routing like google maps
export function NavigationPage({ navigation }: NavigationPageScreenProps): JSX.Element {
    const { t, i18n } = useTranslation();
    const starting_route = t('navigation_table.starting_route');
    const end_route = t('navigation_table.end_route');
    const save_result = t('navigation_table.save_result');
    const final_stats = t('navigation_table.final_stats');
    const final_time = t('navigation_table.final_time');
    const starting_heart_rate = t('navigation_table.starting_heart_rate');
    const ending_heart_rate = t('navigation_table.ending_heart_rate');
    const failed_save = t('navigation_table.failed_save');
    const successfull_save = t('navigation_table.successfull_save');
    const starting_route_qr_code = "Starting Route";

    const { hasPermission, requestPermission } = useCameraPermission();
    const [cameraIsVisible, setCameraIsVisible] = useState(false);
    const [isCounting, setIsCounting] = useState(false);
    const [isStopwatchVisible, setIsStopwatchVisible] = useState(false);
    const [finalTime, setFinalTime] = useState(0);
    //const [isStepcounterVisible, setIsStepcounterVisible] = useState(false);
    //const [finalSteps, setFinalSteps] = useState(0);
    //const [isSensorsVisible, setIsSensorsVisible] = useState(false);
    const [isFinalStatsVisible, setIsFinalStatsVisible] = useState(false);
    const [isStartButtonVisible, setIsStartButtonVisible] = useState(true);
    const [buttonTitle, setButtonTitle] = useState(starting_route);
    const [isRouting, setIsRouting] = useState(false);
    const {UserId, SetUserId} = useContext(UserIdContext) as UserIdContextType;
    const [routeId, setRouteId] = useState(1); // Hardcoded for now
    const [heartRateStart, setHeartRateStart] = useState('0.0');
    const [isHeartRateStartVisible, setIsHeartRateStartVisible] = useState(true);
    const [heartRateEnd, setHeartRateEnd] = useState('0.0');
    const [isHeartRateEndVisible, setIsHeartRateEndVisible] = useState(false);
    const [isSaveFinalResultButtonVisible, setIsSaveFinalResultButtonVisible] = useState(false);
    const [workoutUpdateIsFailed, setProfileUpdateIsFailed] = useState(false);
    const [workoutUpdateSuccessfully, setProfileUpdateSuccessfully] = useState(false);
    const timestampStart = useRef('');
    const timestampEnd = useRef('');

    const unsubscribe = navigation.addListener('focus', () => {
            if (!hasPermission) {
                requestPermission();
            }
      })

    // For some reason in the useEffect the code doesn't run
    // Camera initialization
    let device: CameraDevice | undefined;
    const devices = Camera.getAvailableCameraDevices();
    if (devices !== null) {
        device = devices.find((d) => d.position === 'back');
    } else {
        device = undefined;
    }
    // Code scanner definition
    const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: (codes) => {VerifyCode(codes)}
    });

    async function VerifyCode(codes: Code[]) {
        try {
            for (const code of codes) {
                console.log('QR Code value : ' + code.value)
                if (code.value === starting_route_qr_code && !(isRouting)) {
                    timestampStart.current = (Date.now().toString());
                    setIsRouting(true);
                    setIsCounting(true);
                    setCameraIsVisible(false);
                    setButtonTitle(end_route)
                    setIsStartButtonVisible(true);
                    setIsStopwatchVisible(true);
                    //setIsStepcounterVisible(true);
                    //setIsSensorsVisible(true);
                    setIsFinalStatsVisible(false);
                    setIsHeartRateStartVisible(false);
                    setIsHeartRateEndVisible(false);
                    setIsSaveFinalResultButtonVisible(false);
                    console.log('Started Routing');
                }
                if (code.value === starting_route_qr_code && isRouting) {
                    timestampEnd.current = Date.now().toString();
                    setIsRouting(false);
                    setIsCounting(false);
                    setCameraIsVisible(false);
                    setButtonTitle(starting_route)
                    setIsStartButtonVisible(false);
                    setIsStopwatchVisible(false);
                    //setIsStepcounterVisible(false);
                    //setIsSensorsVisible(false);
                    setIsFinalStatsVisible(true);
                    setIsHeartRateEndVisible(true);
                    setIsSaveFinalResultButtonVisible(true);
                    console.log('Ended Routing');
                }
            } 
        } catch (error) {
            console.error('Error processing scanned code:', error);
        }
    }

    function StartRoute () {
        if (hasPermission && device !== undefined && heartRateStart !== '') {
            setIsCounting(false);
            setCameraIsVisible(true);
            setIsStartButtonVisible(false);
            setIsStopwatchVisible(false);
            //setIsStepcounterVisible(false);
            //setIsSensorsVisible(false);
            setIsFinalStatsVisible(false);
            setIsHeartRateStartVisible(false);
            setIsHeartRateEndVisible(false);
            setIsSaveFinalResultButtonVisible(false);
            setProfileUpdateSuccessfully(false);
        } else if (!hasPermission) {
            showPermissionAlert();
        } else if (heartRateStart == '') {
            showHearthRateMissingAlert();
        } else if (device === undefined) {
            showDeviceAlert();
        }
    }

    function FinalStats () {
        return ( <>
            <Text style={{color: 'black'}}>{final_stats}: </Text>
            <Text style={{color: 'black'}}>{final_time}: {formatTimeDifference(finalTime)} </Text>
            {/*<Text style={{color: 'black'}}> Your final number of steps is : {finalSteps} </Text>*/}
            </>
        )
    }

    const formatTimeDifference = (final_time: number): string => {
      
        const minutes = Math.floor(final_time / 60);
        const seconds = final_time % 60;
      
        return `${minutes}m ${seconds}s`;
      };

    // TO DO : Some kind of notice about the fact that if the saving failed they can try later when they have internet ?
    // Worth considering if to save in local storage keyed to user and remember eventual status later ?
    async function SaveFinalResult () {
        if (heartRateEnd != '') {
            try {
            const response: SavePerformanceResponse = await SavePerformance({route_id: routeId, user_id: UserId, 
                timestamp_start: timestampStart.current, heart_rate_start: parseFloat(heartRateStart.replace(',','.')), 
                timestamp_end: timestampEnd.current, heart_rate_end: parseFloat(heartRateEnd.replace(',','.'))});
            if (response.response_code == created) {
                setIsStartButtonVisible(true);
                setIsSaveFinalResultButtonVisible(false);
                setIsHeartRateEndVisible(false);
                setProfileUpdateSuccessfully(true);
                setProfileUpdateIsFailed(false);
            } else {
                setProfileUpdateIsFailed(true);
            }
            setIsHeartRateEndVisible(false);
            } catch (err) {
                console.log ('something went wrong' + err);
            }
        } else {
            showSaveHearthRateMissingAlert();
        }       
    }

    // Alerts added here because i can't use i18next outside of a component
    const permission_notice = t('alerts.permission_notice');
    const camera_notice = t('alerts.camera_notice');
    const missing_info_notice = t('alerts.missing_info_notice');

    const permission_alert = t('alerts.permission_alert');
    const camera_alert = t('alerts.camera_alert');
    const missing_info_start_alert = t('alerts.missing_info_start_alert');
    const missing_info_end_alert = t('alerts.missing_info_end_alert');

    function showPermissionAlert () {
        Alert.alert(
        permission_notice,
        permission_alert,
        [{ text: 'Ok', style: 'default',}]);
    }
    
    function showDeviceAlert () {
        Alert.alert(
        camera_notice,
        camera_alert,
        [{ text: 'Ok', style: 'default',}]);
    }
    
    function showHearthRateMissingAlert () {
        Alert.alert(
        missing_info_notice,
        missing_info_start_alert,
        [{ text: 'Ok', style: 'default',}]);
    }
    
    function showSaveHearthRateMissingAlert () {
        Alert.alert(
        missing_info_notice,
        missing_info_end_alert,
        [{ text: 'Ok', style: 'default',}]);
    }

    return (
        <View style={styles.navigation}>
        { (cameraIsVisible && device !== undefined) && 
        <>
            <Camera
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={true}
            codeScanner={codeScanner}
            />
        </>
        }
        <View style={!isStopwatchVisible && {display: 'none'}}><Stopwatch isCounting={isRouting} setFinalTime={setFinalTime}></Stopwatch></View>
        {/*<View style={!isStepcounterVisible && {display: 'none'}}><StepCounter isCounting={isCounting} setFinalSteps={setFinalSteps}></StepCounter></View>*/}
        {/*<View style={!isSensorsVisible && {display: 'none'}}><Sensors isCounting={isCounting}></Sensors></View>*/}
        {   isHeartRateStartVisible &&
            <>
            <Text style={styles.label}>{starting_heart_rate}:</Text>
            <TextInput style={styles.input} keyboardType="numeric" placeholder="0.0" placeholderTextColor="grey" value={heartRateStart} onChangeText={(text) => setHeartRateStart(text)} />
            </> 
        }
        {   isHeartRateEndVisible &&
            <>
            <Text style={styles.label}>{ending_heart_rate}:</Text>
            <TextInput style={styles.input} keyboardType="numeric" placeholder="0.0" placeholderTextColor="grey" value={heartRateEnd} onChangeText={(text) => setHeartRateEnd(text)} />
            </> 
        }
        {isSaveFinalResultButtonVisible && <Button onPress={() => SaveFinalResult()} title={save_result} />}
        {workoutUpdateIsFailed && (<Text style={styles.warningText}>{failed_save}</Text>)}
        {workoutUpdateSuccessfully && (<Text style={styles.successText}>{successfull_save}</Text>)}
        {isStartButtonVisible && <Button onPress={() => StartRoute()} title={buttonTitle} />}
        {isFinalStatsVisible && <FinalStats></FinalStats>}
      </View>
    );
  };
  
  export default NavigationPage;