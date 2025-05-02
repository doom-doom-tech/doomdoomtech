import {StyleSheet, TouchableOpacity, View} from 'react-native'
import {useCallback, useMemo} from "react";
import {palette} from "@/theme";
import Bell from "@/assets/icons/Bell";
import {router} from "expo-router";
import useAlertCount from "@/features/alert/hooks/useAlertCount";
import BellMasked from "@/assets/icons/BellMasked";
import useGlobalUserContext from "@/features/user/hooks/useGlobalUserContext";

interface AlertBellProps {

}

const AlertBell = ({}: AlertBellProps) => {

    const alertsCountQuery = useAlertCount()
    const user = useGlobalUserContext()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                position: 'relative'
            },
            notify: {
                position: 'absolute',
                width: 12,
                height: 12,
                top: -2,
                right: -4,
                backgroundColor: palette.error,
                borderRadius: 16,
            }
        })
    }, []);

    const routeAlerts = useCallback(() => {
        if(!user) return router.push('/auth')

        router.push(`/alerts`)
    }, [user])

    const shouldNotify = useMemo(() => {
        if(alertsCountQuery.isError || alertsCountQuery.isLoading || alertsCountQuery.data === undefined) return false
        return alertsCountQuery.data > 0
    }, [alertsCountQuery])

    return(
        <TouchableOpacity onPress={routeAlerts} style={styles.wrapper}>
            { shouldNotify
                ? <BellMasked color={palette.offwhite} />
                : <Bell color={palette.offwhite} />
            }

            { shouldNotify && (
                <View style={styles.notify} />
            )}
        </TouchableOpacity>
    )
}

export default AlertBell