import React, { useEffect, useRef, useState, RefObject } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import sensors from "react-native-sensors";
import { setUpdateIntervalForType, SensorTypes, SensorData } from "react-native-sensors";
import { accelerometer } from "react-native-sensors";
import { map, filter } from "rxjs/operators";
import { of, Observable, Subscription } from "rxjs";
import { Subscriber } from 'rxjs';


interface SensorshProps {
    isCounting: boolean;
  }

export const Sensors: React.FC<SensorshProps> = ({ isCounting }) => {
    const [X, setX] = useState(0);
    const [Y, setY] = useState(0);
    const [Z, setZ] = useState(0);
    let accelerometerSubscription: Subscription;

    setUpdateIntervalForType(SensorTypes.accelerometer, 200); // defaults to 100ms

    useEffect(() => {
        console.log('Sensor is effecting + isCounting ' + isCounting)
        console.log('accelerometerSubscription ' + accelerometerSubscription)
        if (isCounting) {
            if (accelerometerSubscription === undefined) {
                console.log('Sensor is counting')
                accelerometerSubscription = accelerometer.subscribe(({ x, y, z }) => {setX(x); setY(y); setZ(z)});
        }
        } else {
            if (accelerometerSubscription !== undefined) {
                console.log('Sensor is not counting')
                accelerometerSubscription.unsubscribe();
            }
        }
        }, [isCounting]);

return ( <>
    <Text style={{color: 'black'}}>X : {X.toFixed(2)}</Text>
    <Text style={{color: 'black'}}>Y : {Y.toFixed(2)}</Text>
    <Text style={{color: 'black'}}>Z : {Z.toFixed(2)}</Text>
</>  
)
}

export default Sensors;
