import { Alert } from 'react-native';

export function showPermissionAlert () {
    Alert.alert(
    'Permission Notice',
    'You can\'t start the route without giving the app permission to use the camera',
    [{ text: 'Ok', style: 'default',}]);
}

export function showDeviceAlert () {
    Alert.alert(
    'Camera Notice',
    'It looks like your phone doesn\'t have an avaliable back camera',
    [{ text: 'Ok', style: 'default',}]);
}

export function showHearthRateMissingAlert () {
    Alert.alert(
    'Missing info Notice',
    'Before starting the route you need to set your heart rate',
    [{ text: 'Ok', style: 'default',}]);
}

export function showSaveHearthRateMissingAlert () {
    Alert.alert(
    'Missing info Notice',
    'Before saving the workout you need to set your heart rate',
    [{ text: 'Ok', style: 'default',}]);
}

export function showDataFailedToSave () {
    Alert.alert(
    'Failed to save initial data',
    'Please scan again the QR code to start',
    [{ text: 'Ok', style: 'default',}]);
}