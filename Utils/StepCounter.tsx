/*import React, { useEffect, useState } from 'react';
import { Text } from "react-native";
import {
    isStepCountingSupported,
    parseStepData,
    startStepCounterUpdate,
    stopStepCounterUpdate,
  } from '@dongminyu/react-native-step-counter';

  interface StepCounterProps {
    isCounting: boolean;
    setFinalSteps: Function;
  }

  export const StepCounter: React.FC<StepCounterProps> = ({isCounting, setFinalSteps}) => {
        const [supported, setSupported] = useState(false);
        const [granted, setGranted] = useState(false);
        const [steps, setSteps] = useState(0);
        const [distance, setDistance] = useState(0);

        useEffect(() => {
            askPermission();
        }, []);

        useEffect(() => {
            if (isCounting) {
                console.log('steps started');
                setSteps(0);
                setDistance(0);
                startStepCounterUpdate(new Date(), (data) => {
                    console.debug(parseStepData(data));
                    setSteps(data.steps);
                    setDistance(data.distance);
                    });
            } else {
                setFinalSteps(steps);
                stopStepCounterUpdate();
            }
        }, [setSteps, isCounting]);

        async function askPermission() {
            console.log('steps ended')
            isStepCountingSupported().then((result) => {
            console.debug('🚀 - isStepCountingSupported', result);
            setGranted(result.granted === true);
            setSupported(result.supported === true);
            });
        }

        return ( <>
            <Text style={{color: 'black'}}>Steps : {steps}</Text>
            <Text style={{color: 'black'}}>Distance : {distance.toFixed(1)}m</Text>
        </>  
        )
  }*/