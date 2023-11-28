import EncryptedStorage from 'react-native-encrypted-storage';

export async function saveUserSession(SessionName: string, SessionObject: any) {
    try {
        await EncryptedStorage.setItem(
            SessionName,
            JSON.stringify(SessionObject)
        );
        console.log('Object ' + SessionName + ' saved')
    } catch (error) {
        console.error('There was an error ' + error)
    }
}

export async function retrieveUserSession(SessionName: string) {
    try {   
        const session = await EncryptedStorage.getItem(SessionName);
    
        if ((session !== undefined) && (session !== null)) {
            console.log('Object ' + SessionName + ' retrieved')
            return session
        }
    } catch (error) {
        console.error('There was an error ' + error)
    }
}

export async function removeUserSession(SessionName: string) {
    try {
        await EncryptedStorage.removeItem(SessionName);
        console.log('Object ' + SessionName + ' removed')
    } catch (error) {
        console.error('There was an error ' + error)
    }
}