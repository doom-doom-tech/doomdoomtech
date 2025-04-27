import {StyleSheet, View} from 'react-native'
import {useCallback, useMemo} from "react";
import List, {ListRenderItemPropsInterface} from "@/common/components/List";
import User from "@/features/user/classes/User";
import UserContextProvider from "@/features/user/context/UserContextProvider";
import SuggestedUser from "@/features/user/components/SuggestedUser";
import useUserSuggested from "@/features/user/hooks/useUserSuggested";
import Text from "@/common/components/Text";
import {palette, spacing} from "@/theme";

interface SuggestedUsersProps {

}

const SuggestedUsers = ({}: SuggestedUsersProps) => {

    const suggestedUsersQuery = useUserSuggested()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                paddingVertical: spacing.m,
                gap: spacing.s,
                borderBottomWidth: 2,
                borderBottomColor: palette.granite
            },
            title: {
                fontSize: 24,
                marginLeft: spacing.m,
                color: palette.offwhite
            },
            container: {
                paddingLeft: spacing.m,
                gap: spacing.m,
            }
        })
    }, []);

    const RenderItem = useCallback(({item, index}: ListRenderItemPropsInterface<User>) => (
        <UserContextProvider user={item} key={index}>
            <SuggestedUser />
        </UserContextProvider>
    ), [])

    return(
        <View style={styles.wrapper}>
            <Text style={styles.title}>
                Build your network
            </Text>
            <List
                <User>
                horizontal
                infinite
                renderItem={RenderItem}
                query={suggestedUsersQuery}
                contentContainerStyle={styles.container}
            />
        </View>
    )
}

export default SuggestedUsers