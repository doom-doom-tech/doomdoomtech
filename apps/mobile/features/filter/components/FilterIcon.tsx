import {StyleSheet, TouchableOpacity, View} from 'react-native'
import {Fragment, useCallback, useMemo} from "react";
import Filter from "@/assets/icons/Filter";
import {AvailableFilters, useFilterStoreSelectors, useFilterStoreValues} from "@/features/filter/store/filter";
import {router} from "expo-router";
import {palette} from "@/theme";

interface FilterIconProps {
    available: Array<AvailableFilters>
}

const FilterIcon = ({available}: FilterIconProps) => {

    const setFilterState = useFilterStoreSelectors.setState()
    const filters = useFilterStoreValues()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                position: 'relative',
                width: 24,
                height: 24
            },
            dot: {
                borderRadius: 12,
                top: -4, right: -4,
                position: 'absolute',
                width: 8, height: 8,
                backgroundColor: palette.error
            }
        })
    }, []);

    const active = useMemo(() => {
        return Boolean(filters.genre) || Boolean(filters.subgenre) || Boolean(filters.label)
    }, [filters])

    const NotifyDot = useCallback(() => {
        return active ?  <View style={styles.dot} /> : <Fragment />
    }, [active])

    const triggerFilterSheet = useCallback(() => {
        setFilterState({ available })
        router.push('/(sheets)/filters/overview')
    }, [])

    return(
        <TouchableOpacity style={styles.wrapper} onPress={triggerFilterSheet}>
            <Filter />
            <NotifyDot />
        </TouchableOpacity>
    )
}

export default FilterIcon