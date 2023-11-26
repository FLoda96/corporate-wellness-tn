import React, { useState, useEffect } from 'react';
import { View, ScrollView, TextInput, Button, StyleSheet, Text, Alert } from 'react-native';
import {NavigationPageScreenProps} from './NavigationTypes'
import { Camera, CameraDevice, useCameraDevice, useCameraPermission, useCodeScanner, Code } from "react-native-vision-camera"
import {showPermissionAlert, showDeviceAlert} from './Alert'
import {Stopwatch} from './Stopwatch'

export function NavigationPage({ navigation }: NavigationPageScreenProps): JSX.Element {
    const { hasPermission, requestPermission } = useCameraPermission();
    const [cameraIsVisible, setCameraIsVisible] = useState(false);
    const [isCounting, setIsCounting] = useState(false);
    const [isStopwatchVisible, setIsStopwatchVisible] = useState(false);
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
        for (const code of codes) {
            console.log('QR Code value : ' + code.value)
            if (code.value === 'Starting Route' && !(isRouting)) {
                setCameraIsVisible(false);
                setButtonTitle('End Route')
                setIsStartButtonVisible(true);
                setIsStopwatchVisible(true);
                setIsCounting(true);
                setIsRouting(true);
                console.log('Routing')
            }
            if (code.value === 'Starting Route' && isRouting) {
                setCameraIsVisible(false);
                setButtonTitle('Start Route')
                setIsStartButtonVisible(true);
                setIsStopwatchVisible(false);
                setIsCounting(false);
                setIsRouting(false);
                console.log('Ended Routing')
            }

        }
    }

    function StartRoute () {
        if (hasPermission && device !== undefined) {
            setCameraIsVisible(true);
            setIsStartButtonVisible(false);
            setIsStopwatchVisible(false);
        } else if (!hasPermission) {
            showPermissionAlert();
        } else if (device === undefined) {
            showDeviceAlert();
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
        {isStopwatchVisible && <Stopwatch isCounting={isCounting}></Stopwatch>}
        {isStartButtonVisible && <Button onPress={() => StartRoute()} title={buttonTitle} />}
      </View>
    );
  };
  
  export default NavigationPage;