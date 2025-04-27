import {StyleSheet, TouchableOpacity} from 'react-native'
import {useCallback, useMemo} from "react";
import Screen from "@/common/components/Screen";
import Header from "@/common/components/header/Header";
import Filter from "@/assets/icons/Filter";
import {router, useFocusEffect, useLocalSearchParams} from "expo-router";
import {initialFilterStore, useFilterStoreSelectors} from "@/features/filter/store/filter";
import LabelInboxLists from "@/features/label/components/label-inbox/LabelInboxLists";

interface LabelInboxProps {

}

const LabelInbox = ({}: LabelInboxProps) => {

    const setFilterState = useFilterStoreSelectors.setState()

    const { tag } = useLocalSearchParams()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
        })
    }, []);

    const handleOpenFilters = useCallback(() => {
        setFilterState({ available: ['period'] })
        router.push('/filters/overview')
    }, [])

    const RightComponent = useCallback(() => (
        <TouchableOpacity onPress={handleOpenFilters}>
            <Filter />
        </TouchableOpacity>
    ), [])

    useFocusEffect(() => {
        tag && setFilterState({ ...initialFilterStore, label: tag as string })
    })

    return(
        <Screen>
            <Header title={"Label inbox"} RightComponent={RightComponent} />
            <LabelInboxLists />
        </Screen>
    )
}

export default LabelInbox