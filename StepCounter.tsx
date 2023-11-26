import React, { useEffect, useState } from 'react';
import { Text } from "react-native";
import {
    isStepCountingSupported,
    parseStepData,
    startStepCounterUpdate,
    stopStepCounterUpdate,
  } from '@dongminyu/react-native-step-counter';

  interface StepCounterProps {
    isCounting: boolean;
  }

  export const StepCounter: React.FC<StepCounterProps> = ({isCounting}) => {
        const [supported, setSupported] = useState(false);
        const [granted, setGranted] = useState(false);
        const [steps, setSteps] = useState(0);
        const [distance, setDistance] = useState(0);
        //const [calories, setCalories] = useState(0);

        useEffect(() => {
            askPermission();
        }, []);

        useEffect(() => {
            if (isCounting) {
                startStepCounterUpdate(new Date(), (data) => {
                    console.debug(parseStepData(data));
                    setSteps(data.steps);
                    setDistance(data.distance);
                    //setCalories(data.calories);
                    });
            } else {
                stopStepCounterUpdate();
            }
        }, [setSteps]);

        async function askPermission() {
            isStepCountingSupported().then((result) => {
            console.debug('🚀 - isStepCountingSupported', result);
            setGranted(result.granted === true);
            setSupported(result.supported === true);
            });
        }

        //<Text style={{color: 'black'}}>Calories : {calories}</Text>
        return ( <>
            <Text style={{color: 'black'}}>Steps : {steps}</Text>
            <Text style={{color: 'black'}}>Distance : {distance.toFixed(1)}m</Text>
        </>  
        )
  }