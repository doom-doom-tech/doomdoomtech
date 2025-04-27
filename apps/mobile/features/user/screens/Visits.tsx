import {StyleSheet} from 'react-native'
import {useCallback, useMemo} from "react";
import Screen from "@/common/components/Screen";
import Header from "@/common/components/header/Header";
import useUserVisits from "@/features/user/hooks/useUserVisits";
import List, {ListRenderItemPropsInterface} from "@/common/components/List";
import User from "@/features/user/classes/User";
import UserRow from "@/features/user/components/user-row/UserRow";
import UserContextProvider from "@/features/user/context/UserContextProvider";
import {getTimePassedSince} from "@/common/services/utilities";

interface VisitsProps {

}

const Visits = ({}: VisitsProps) => {

    const userVisitsQuery = useUserVisits()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
            container: {

            }
        })
    }, []);

    const RenderItem = useCallback(({item, index}: ListRenderItemPropsInterface<User>) => (
        <UserContextProvider user={item}>
            <UserRow type={'no-action'} subtitle={getTimePassedSince(new Date(item.serialize().created as Date))} />
        </UserContextProvider>
    ), [])

    return(
        <Screen>
            <Header title={"Profile visits"} />
            <List infinite query={userVisitsQuery} renderItem={RenderItem} contentContainerStyle={styles.container} />
        </Screen>
    )
}

export default Visits