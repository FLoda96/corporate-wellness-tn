import { useState, useRef, useEffect } from 'react';
import { Text } from "react-native";

interface StopwatchProps {
    isCounting: boolean;
    setFinalTime: Function;
  }

export const Stopwatch: React.FC<StopwatchProps> = ({isCounting, setFinalTime}) => {
  const [startTime, setStartTime] = useState(0);
  const [now, setNow] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

useEffect(() => {
    if (isCounting) {
        handleStart();
    } else {
        handleStop();
    }
    }, [isCounting]);

  function handleStart() {
    setStartTime(Date.now());
    setNow(Date.now());

    if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    intervalRef.current = setInterval(() => {
      setNow(Date.now());
    }, 10);
  }

  function handleStop() {
    if (startTime != null && now != null) {
      let Final = (now - startTime) / 1000;
      setFinalTime(Final);
    }
    if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
  }

  let secondsPassed = 0;
  if (startTime != null && now != null) {
    secondsPassed = (now - startTime) / 1000;
  }

  return (
    <Text style={{color: 'black'}}>Time passed: {secondsPassed.toFixed(2)}</Text> 
  );
};

export default Stopwatch;
