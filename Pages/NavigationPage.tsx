import React, { useState, useEffect, useContext } from 'react';
import { View, ScrollView, TextInput, Button, StyleSheet, Text, Alert } from 'react-native';
import {NavigationPageScreenProps} from '../Utils/NavigationTypes'
import { Camera, CameraDevice, useCameraDevice, useCameraPermission, useCodeScanner, Code } from "react-native-vision-camera"
import {showPermissionAlert, showDeviceAlert, showHearthRateMissingAlert, showDataFailedToSave, showSaveHearthRateMissingAlert} from '../Utils/Alert'
import {Stopwatch} from '../Utils/Stopwatch'
import {StepCounter} from '../Utils/StepCounter'
import {Sensors} from '../Utils/Sensors'
import { UserIdContext, UserIdContextType } from '../Utils/AuthContext'
import { ok, created, SavePerformance, UpdatePerformance, SavePerformanceResponse, UpdatePerformanceResponse } from '../Utils/WebServerUtils'
import { styles } from '../Utils/Styles'



export function NavigationPage({ navigation }: NavigationPageScreenProps): JSX.Element {
    const StartingRoute = "Starting Route";
    const StartRouteText = "Start Route";
    const EndRouteText = "End Route";
    const { hasPermission, requestPermission } = useCameraPermission();
    const [cameraIsVisible, setCameraIsVisible] = useState(false);
    const [isCounting, setIsCounting] = useState(false);
    const [isStopwatchVisible, setIsStopwatchVisible] = useState(false);
    const [finalTime, setFinalTime] = useState(0);
    const [isStepcounterVisible, setIsStepcounterVisible] = useState(false);
    const [finalSteps, setFinalSteps] = useState(0);
    const [isSensorsVisible, setIsSensorsVisible] = useState(false);
    const [isFinalStatsVisible, setIsFinalStatsVisible] = useState(false);
    const [isStartButtonVisible, setIsStartButtonVisible] = useState(true);
    const [buttonTitle, setButtonTitle] = useState(StartingRoute);
    const [isRouting, setIsRouting] = useState(false);
    const {UserId, SetUserId} = useContext(UserIdContext) as UserIdContextType;
    const [routeId, setRouteId] = useState(1);
    const [heartRateStart, setHeartRateStart] = useState('');
    const [isHeartRateStartVisible, setIsHeartRateStartVisible] = useState(true);
    const [heartRateEnd, setHeartRateEnd] = useState('');
    const [isHeartRateEndVisible, setIsHeartRateEndVisible] = useState(false);
    const [isSaveFinalResultButtonVisible, setIsSaveFinalResultButtonVisible] = useState(false);
    const [workoutUpdateIsFailed, setProfileUpdateIsFailed] = useState(false);
    const [workoutUpdateSuccessfully, setProfileUpdateSuccessfully] = useState(false);
    const [performanceId, setPerformanceId] = useState(0);
    const [timestampStart, setTimestampStart] = useState('');
    const [timestampEnd, setTimestampEnd] = useState('');
    
    var FinalResultButtonTitle = 'Save Result';   

    // First thing happening upon entering the page
    // I tried doing it after starting the route but
    // For some reasons it didn't returned the value even with an async function
    useEffect(() => {
        if (!hasPermission) {
            requestPermission();
            setTimestampEnd('aaaa');
            console.log(timestampEnd);
        }
    }, []);

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
                if (code.value === StartingRoute && !(isRouting)) {
                    const result = await SaveInitialData();
                    if (result) {
                        setIsRouting(true);
                        setIsCounting(true);
                        setCameraIsVisible(false);
                        setButtonTitle(EndRouteText)
                        setIsStartButtonVisible(true);
                        setIsStopwatchVisible(true);
                        setIsStepcounterVisible(true);
                        setIsSensorsVisible(true);
                        setIsFinalStatsVisible(false);
                        setIsHeartRateStartVisible(false);
                        setIsHeartRateEndVisible(false);
                        setIsSaveFinalResultButtonVisible(false);
                        console.log('Started Routing');
                    } else {
                        showDataFailedToSave();
                        setIsRouting(false);
                        setIsCounting(false);
                        setCameraIsVisible(false);
                        setIsStartButtonVisible(true);
                        setIsStopwatchVisible(false);
                        setIsStepcounterVisible(false);
                        setIsSensorsVisible(false);
                        setIsFinalStatsVisible(false);
                        setIsHeartRateStartVisible(false);
                        setIsHeartRateEndVisible(false);
                        setIsSaveFinalResultButtonVisible(false);
                    }
                }
                if (code.value === StartingRoute && isRouting) {
                    setIsRouting(false);
                    setIsCounting(false);
                    setCameraIsVisible(false);
                    setButtonTitle(StartRouteText)
                    //setIsStartButtonVisible(true);
                    setIsStartButtonVisible(false);
                    setIsStopwatchVisible(false);
                    setIsStepcounterVisible(false);
                    setIsSensorsVisible(false);
                    setIsFinalStatsVisible(true);
                    //setIsHeartRateStartVisible(true);
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
            setIsStepcounterVisible(false);
            setIsSensorsVisible(false);
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
            <Text style={{color: 'black'}}> Your final stats are : </Text>
            <Text style={{color: 'black'}}> Your final time is : {finalTime.toFixed(2)} </Text>
            <Text style={{color: 'black'}}> Your final number of steps is : {finalSteps} </Text>
            </>
        )
    }

    // TO DO : Actually deal with the fact that the timestamp could not be the correct ones because they are not updated
    // For now i'll just set the function directly as argument
    // NOTE that this will add the time the user take to type in the final hearth rate as actual time because react is stupid
    async function SaveInitialData() {
        setTimestampStart(Date.now().toString());
        console.log("Timestamp Start : " + timestampStart);
        try {
        const response: SavePerformanceResponse = await SavePerformance({route_id: routeId, user_id: UserId, timestamp_start: Date.now().toString(), heart_rate_start: parseFloat(heartRateStart.replace(',','.')) })
        if (response.response_code == created) {
            setPerformanceId(response.performance_id);
            return true;
        } else {
            return false;
        }
        } catch (err) {
            console.log ('something went wrong' + err);
        }
    }

    async function SaveFinalResult () {
        if (heartRateEnd != '') {
            setTimestampEnd(Date.now().toString());
            console.log("Timestamp : " + Date.now().toString());

            try {
            const response: UpdatePerformanceResponse = await UpdatePerformance({performance_id: performanceId, timestamp_end: Date.now().toString(), heart_rate_end: parseFloat(heartRateEnd.replace(',','.')) });
            if (response.response_code == ok) {
                setIsStartButtonVisible(true);
                setIsSaveFinalResultButtonVisible(false);
                setIsHeartRateEndVisible(false);
                setProfileUpdateSuccessfully(true);
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

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        { (cameraIsVisible && device !== undefined) && 
        <>
            <Camera
            //style={{ width: 500, height: 800 }}
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={true}
            codeScanner={codeScanner}
            />
        </>
        }
        <View style={!isStopwatchVisible && {display: 'none'}}><Stopwatch isCounting={isRouting} setFinalTime={setFinalTime}></Stopwatch></View>
        <View style={!isStepcounterVisible && {display: 'none'}}><StepCounter isCounting={isCounting} setFinalSteps={setFinalSteps}></StepCounter></View>
        <View style={!isSensorsVisible && {display: 'none'}}><Sensors isCounting={isCounting}></Sensors></View>
        {   isHeartRateStartVisible &&
            <>
            <Text style={styles.label}>Starting Heart Rate (beats/minute):</Text>
            <TextInput style={styles.input} keyboardType="numeric" placeholder="0.0" placeholderTextColor="grey" value={heartRateStart} onChangeText={(text) => setHeartRateStart(text)} />
            </> 
        }
        {   isHeartRateEndVisible &&
            <>
            <Text style={styles.label}>Ending Heart Rate (beats/minute):</Text>
            <TextInput style={styles.input} keyboardType="numeric" placeholder="0.0" placeholderTextColor="grey" value={heartRateEnd} onChangeText={(text) => setHeartRateEnd(text)} />
            </> 
        }
        {isSaveFinalResultButtonVisible && <Button onPress={() => SaveFinalResult()} title={FinalResultButtonTitle} />}
        {workoutUpdateIsFailed && (<Text style={styles.warningText}>Failed to save workout data</Text>)}
        {workoutUpdateSuccessfully && (<Text style={styles.successText}>Workout saved successfully</Text>)}
        {isStartButtonVisible && <Button onPress={() => StartRoute()} title={buttonTitle} />}
        {isFinalStatsVisible && <FinalStats></FinalStats>}
      </View>
    );
  };
  
  export default NavigationPage;