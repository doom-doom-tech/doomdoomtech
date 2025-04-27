import { useCallback } from 'react'
import { Alert } from 'react-native'
import * as Updates from 'expo-updates'

const useExpoUpdates = () => {

    const checkForUpdates = useCallback(async () => {
        if (__DEV__) return;

        try {
            const update = await Updates.checkForUpdateAsync();

            if (update.isAvailable) {
                await Updates.fetchUpdateAsync();

                Alert.alert(
                    "New update",
                    "A newer version of the app is available. We need to restart your app to install the latest update",
                    [
                        {
                            text: "OK",
                            onPress: () => Updates.reloadAsync()
                        }
                    ]
                )
            }
        } catch (error) {
            console.error(`Error checking for updates: ${error}`);
        }
    }, []);

    return { checkForUpdates };
};

export default useExpoUpdates;