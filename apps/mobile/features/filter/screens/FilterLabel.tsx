import {StyleSheet, View} from 'react-native'
import {useCallback, useMemo} from "react";
import Header from "@/common/components/header/Header";
import {useFilterStoreSelectors} from "@/features/filter/store/filter";
import {palette, spacing} from "@/theme";
import ActionText from "@/common/components/ActionText";
import {router} from "expo-router";
import useLabels from "@/features/label/hooks/useLabels";
import UserRow from "@/features/user/components/user-row/UserRow";
import User from "@/features/user/classes/User";
import List, {ListRenderItemPropsInterface} from "@/common/components/List";
import UserContextProvider from "@/features/user/context/UserContextProvider";
import ClearFilterButton from "@/features/filter/components/ClearFilterButton";

interface FilterPeriodProps {

}

const FilterPeriod = ({}: FilterPeriodProps) => {

    const labelsQuery = useLabels()

    const tag = useFilterStoreSelectors.label()
    const setFilterState = useFilterStoreSelectors.setState()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
            label: {
                padding: spacing.m,
                color: palette.offwhite
            },
            container: {
                gap: spacing.s,
                paddingHorizontal: spacing.m,
            }
        })
    }, []);

    const handleSelectLabel = useCallback((label: User) =>  () => {
        setFilterState({ label: label.getUsername() })
    }, [])

    const RightComponent = useCallback(() => (
        <ActionText callback={router.back} label={"Save"} />
    ), [])

    const RenderItem = useCallback(({item, index}: ListRenderItemPropsInterface<User>) => (
        <UserContextProvider user={item}>
            <UserRow
                selectable
                type={'no-action'}
                callback={handleSelectLabel(item)}
                selected={tag === item.getUsername()}
            />
        </UserContextProvider>
    ), [tag, handleSelectLabel])

    return(
        <View style={styles.wrapper}>
            <Header title={"Label tag"} RightComponent={RightComponent} />
            <View style={styles.content}>
                <List <User> infinite query={labelsQuery} renderItem={RenderItem} contentContainerStyle={styles.container} />
            </View>
            <ClearFilterButton filter={'label'} />
        </View>
    )
}

export default FilterPeriod