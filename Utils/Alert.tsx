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