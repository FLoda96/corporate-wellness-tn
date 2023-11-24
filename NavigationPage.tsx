import React, { useState, useEffect } from 'react';
import { View, ScrollView, TextInput, Button, StyleSheet, Text, Alert } from 'react-native';
import {NavigationPageScreenProps} from './NavigationTypes'
import { Camera, CameraDevice, useCameraDevice, useCameraPermission, useCodeScanner } from "react-native-vision-camera"
import {showPermissionAlert, showDeviceAlert} from './Alert'

export function NavigationPage({ navigation }: NavigationPageScreenProps): JSX.Element {
    const { hasPermission, requestPermission } = useCameraPermission();
    const [cameraIsVisible, setCameraIsVisible] = useState(false);
    
    // First thing happening upon entering the page
    // I tried doing it after starting the route but
    // For some reasons it didn't returned the value even with an async function
    if (!hasPermission) {
        requestPermission();
    }

    let device: CameraDevice | undefined;
    const devices = Camera.getAvailableCameraDevices();
    if (devices !== null) {
        device = devices.find((d) => d.position === 'back')
    } else {
        device = undefined
    }

    const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: (codes) => {
        for (const code of codes) {
        console.log('QR Code value : ' + code.value)
        if (code.value === 'Starting Route') {
            setCameraIsVisible(false);
            console.log('Routing')
        } /*else if (code.value === 'Starting Route') {
            console.log('Not Routing')
        }*/
        }
    }});

    function StartRoute () {
        if (hasPermission && device !== undefined) {
            setCameraIsVisible(true);
        } else if (!hasPermission) {
            showPermissionAlert();
        } else if (device === undefined) {
            showDeviceAlert();
        }
    }

    return (
        <ScrollView>
        { (cameraIsVisible && device !== undefined) && 
            <Camera
            style={{ width: 500, height: 800 }}
            //style={StyleSheet.absoluteFill}
            device={device}
            isActive={true}
            codeScanner={codeScanner}
            />
        }
        <Button onPress={() => StartRoute()} title="Start Route" />
      </ScrollView>
    );
  };
  
  export default NavigationPage;