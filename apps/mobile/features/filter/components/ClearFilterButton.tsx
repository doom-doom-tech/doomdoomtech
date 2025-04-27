import {StyleSheet, TouchableOpacity} from 'react-native'
import {useCallback, useMemo} from "react";
import {AvailableFilters, initialFilterStore, useFilterStoreSelectors} from "@/features/filter/store/filter";
import {router} from "expo-router";
import Text from "@/common/components/Text";
import {palette, spacing} from "@/theme";

interface ClearFilterButtonProps {
    filter: AvailableFilters | 'all'
}

const ClearFilterButton = ({filter}: ClearFilterButtonProps) => {

    const setFilterState = useFilterStoreSelectors.setState()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                height: 60,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: palette.transparent,
                margin: spacing.m
            },
            label: {
                color: palette.rose
            }
        })
    }, []);

    const handleClearFilter = useCallback(() => {
        if(filter === 'all') {
            setFilterState(initialFilterStore)
        } else {
            setFilterState({ [filter]: initialFilterStore[filter] })
        }

        router.back()
    }, [filter])

    return(
        <TouchableOpacity onPress={handleClearFilter} style={styles.wrapper}>
            <Text style={styles.label}>
                { filter === 'all' ? 'Clear all filters' : 'Clear filter' }
            </Text>
        </TouchableOpacity>

    )
}

export default ClearFilterButton