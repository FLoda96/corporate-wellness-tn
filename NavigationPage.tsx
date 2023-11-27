import React, { useState, useEffect } from 'react';
import { View, ScrollView, TextInput, Button, StyleSheet, Text, Alert } from 'react-native';
import {NavigationPageScreenProps} from './NavigationTypes'
import { Camera, CameraDevice, useCameraDevice, useCameraPermission, useCodeScanner, Code } from "react-native-vision-camera"
import {showPermissionAlert, showDeviceAlert} from './Alert'
import {Stopwatch} from './Stopwatch'
import {StepCounter} from './StepCounter'
import {Sensors} from './Sensors'


export function NavigationPage({ navigation }: NavigationPageScreenProps): JSX.Element {
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
    const [buttonTitle, setButtonTitle] = useState('Start Route');
    const [isRouting, setIsRouting] = useState(false);

    // First thing happening upon entering the page
    // I tried doing it after starting the route but
    // For some reasons it didn't returned the value even with an async function
    useEffect(() => {
        if (!hasPermission) {
            requestPermission();
        }
    }, []);

    // For some reason in the useEffect the code doesn't run
    let device: CameraDevice | undefined;
    const devices = Camera.getAvailableCameraDevices();
    if (devices !== null) {
        device = devices.find((d) => d.position === 'back')
    } else {
        device = undefined
    }

    const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: (codes) => {VerifyCode(codes)}
    });

    function VerifyCode(codes: Code[]) {
        try {
        for (const code of codes) {
            console.log('QR Code value : ' + code.value)
            if (code.value === 'Starting Route' && !(isRouting)) {
                setIsRouting(true);
                setIsCounting(true);
                setCameraIsVisible(false);
                setButtonTitle('End Route')
                setIsStartButtonVisible(true);
                setIsStopwatchVisible(true);
                setIsStepcounterVisible(true);
                setIsSensorsVisible(true);
                setIsFinalStatsVisible(false);
                console.log('Started Routing');
            }
            if (code.value === 'Starting Route' && isRouting) {
                setIsRouting(false);
                setIsCounting(false);
                setCameraIsVisible(false);
                setButtonTitle('Start Route')
                setIsStartButtonVisible(true);
                setIsStopwatchVisible(false);
                setIsStepcounterVisible(false);
                setIsSensorsVisible(false);
                setIsFinalStatsVisible(true);
                console.log('Ended Routing');
            }
        } 

        } catch (error) {
            console.error('Error processing scanned code:', error);
        }
    }

    function StartRoute () {
        if (hasPermission && device !== undefined) {
            setIsCounting(false);
            setCameraIsVisible(true);
            setIsStartButtonVisible(false);
            setIsStopwatchVisible(false);
            setIsStepcounterVisible(false);
            setIsSensorsVisible(false);
            setIsFinalStatsVisible(false);
        } else if (!hasPermission) {
            showPermissionAlert();
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
        {isStartButtonVisible && <Button onPress={() => StartRoute()} title={buttonTitle} />}
        {isFinalStatsVisible && <FinalStats></FinalStats>}
      </View>
    );
  };
  
  export default NavigationPage;