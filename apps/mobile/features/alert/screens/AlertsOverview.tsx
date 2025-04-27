import {StyleSheet} from 'react-native'
import {useCallback, useMemo} from "react";
import Screen from "@/common/components/Screen";
import Header from "@/common/components/header/Header";
import List, {ListRenderItemPropsInterface} from "@/common/components/List";
import Alert from "@/features/alert/classes/Alert";
import useAlerts from "@/features/alert/hooks/useAlerts";
import AlertContextProvider from "@/features/alert/context/AlertContextProvider";
import AlertRow from "@/features/alert/components/alert-row/AlertRow";

interface AlertsOverviewProps {

}

const AlertsOverview = ({}: AlertsOverviewProps) => {

    const alertsQuery = useAlerts()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
            content: {
                paddingBottom: 200
            }
        })
    }, []);

    const RenderItem = useCallback(({item, index}: ListRenderItemPropsInterface<Alert>) => (
        <AlertContextProvider alert={item}>
            <AlertRow />
        </AlertContextProvider>
    ), [])

    return(
        <Screen>
            <Header title={"Alerts"} />
            <List
                <Alert>
                infinite
                query={alertsQuery}
                renderItem={RenderItem}
                contentContainerStyle={styles.content}
            />
        </Screen>
    )
}

export default AlertsOverview