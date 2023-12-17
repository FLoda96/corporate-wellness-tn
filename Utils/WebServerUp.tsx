import React, {useEffect, useState} from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { HealthCheck } from '../Utils/FunctionUtils';

// TO DO : How specific can the error message be ?
export const WebServerUp = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
           if (await HealthCheck()) {
            setIsVisible(false);
           } else {
            setIsVisible(true);
           }
        };
        // Roundabout way to call the above but async TO DO : search a library that does this
        fetchData();
      }, []);

  return (
    <View>
    { isVisible && (<Text style={{color: 'red', marginVertical: 5}}>Internet connection not avaliable</Text>)}
    </View>
    
  );
};

export default WebServerUp;
