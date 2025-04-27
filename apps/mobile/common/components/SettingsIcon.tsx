import {StyleSheet, TouchableOpacity} from 'react-native'
import {useCallback, useMemo} from "react";
import Cog from "@/assets/icons/Cog";
import {router} from "expo-router";

interface SettingsIconProps {

}

const SettingsIcon = ({}: SettingsIconProps) => {

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
        })
    }, []);

    const handleRouteSettings = useCallback(() => {
        router.push('/settings')
    }, [])

    return(
        <TouchableOpacity onPress={handleRouteSettings} style={styles.wrapper}>
            <Cog />
        </TouchableOpacity>
    )
}

export default SettingsIcon