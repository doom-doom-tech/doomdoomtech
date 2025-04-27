import {StyleSheet} from 'react-native'
import {useCallback, useMemo} from "react";
import {useAlertContext} from "@/features/alert/context/AlertContextProvider";
import _ from 'lodash';
import Text from "@/common/components/Text";
import {palette} from "@/theme";
import {UserInterface} from "@/features/user/types";
import {router} from "expo-router";

interface AlertRowUsernamesProps {

}

const AlertRowUsernames = ({}: AlertRowUsernamesProps) => {

    const alert = useAlertContext()

    const users = alert.getUsers();
    const userCount = _.size(users);
    const totalCount = alert.getCount();
    const remainingCount = totalCount - userCount;

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
            username: {
                fontWeight: '600',
                color: palette.offwhite
            },
            text: {
                color: palette.granite
            }
        })
    }, []);

    const routeUser = useCallback((user: UserInterface) => () => {
        router.push(`/user/${user.id}`)
    }, [])

    switch (alert.getUsers().length) {
        case 1: return (
            <Text style={styles.username} onPress={routeUser(alert.getUsers()[0])}>
                { alert.getUsers()[0].username }
            </Text>
        )

        case 2: return (
            <Text style={styles.text}>
                <Text style={styles.username} onPress={routeUser(alert.getUsers()[0])}>
                    { alert.getUsers()[0].username }
                </Text>
                {` and `}
                <Text style={styles.username} onPress={routeUser(alert.getUsers()[1])}>
                    { alert.getUsers()[1].username }
                </Text>
            </Text>
        )

        default: return (
            <Text style={styles.text}>
                <Text style={styles.username} onPress={routeUser(alert.getUsers()[0])}>
                    { alert.getUsers()[0].username }
                </Text>
                {' and others'}
            </Text>
        )
    }
}

export default AlertRowUsernames