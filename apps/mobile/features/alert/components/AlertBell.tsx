import {StyleSheet, TouchableOpacity, View} from 'react-native'
import {useCallback, useMemo} from "react";
import {palette} from "@/theme";
import Bell from "@/assets/icons/Bell";
import {router} from "expo-router";
import useAlertCount from "@/features/alert/hooks/useAlertCount";
import useGlobalUserContext from "@/features/user/hooks/useGlobalUserContext";
import Text from "@/common/components/Text";
import millify from 'millify';

interface AlertBellProps {

}

const AlertBell = ({}: AlertBellProps) => {

    const alertsCountQuery = useAlertCount()
    const user = useGlobalUserContext()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                position: 'relative',
            },
            notify: {
                position: 'absolute',
                bottom: -4,
                alignSelf: 'center',
                paddingHorizontal: 2,
                backgroundColor: palette.error,
                borderRadius: 2,
                justifyContent: 'center',
                alignItems: 'center'
            },
            count: {
                fontSize: 8,
                color: palette.offwhite
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
            <Bell color={palette.offwhite} />

            { shouldNotify && (
                <View style={styles.notify}>
                    <Text style={styles.count}>
                        {millify(alertsCountQuery.data)}
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    )
}

export default AlertBell