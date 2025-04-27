import {ScrollView, StyleSheet} from 'react-native'
import {useCallback, useMemo} from "react";
import {AvailableFilters, useFilterStoreSelectors, useFilterStoreValues} from "@/features/filter/store/filter";
import _ from "lodash";
import NavigateTab from "@/common/components/NavigateTab";
import Header from "@/common/components/header/Header";
import ActionText from "@/common/components/ActionText";
import {router} from "expo-router";
import ClearFilterButton from "@/features/filter/components/ClearFilterButton";

interface FilterOverviewProps {

}

const FilterOverview = ({}: FilterOverviewProps) => {

    const filters = useFilterStoreValues()
    const available = useFilterStoreSelectors.available()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
        })
    }, []);

    const currentFilterValue = useCallback((item: AvailableFilters): string => {
        switch(item) {
            case "label": return filters.label ?? '';
            case "period": return String(filters.period.label);
            case "genre": return filters.genre?.getName() ?? ''
            case "subgenre": return filters.subgenre?.getName() ?? ''
            default: return ''
        }
    }, [filters])

    const RightComponent = useCallback(() => (
        <ActionText callback={router.back} label={"Save"} />
    ), [])

    return(
        <ScrollView style={styles.wrapper}>
            <Header title={"Filters"} RightComponent={RightComponent} />

            { _.map(available, (item, index) => (
                <NavigateTab
                    title={_.upperFirst(item)}
                    href={`/filters/${item}`}
                    subtitle={currentFilterValue(item)}
                />
            ))}

            <ClearFilterButton filter={'all'} />
        </ScrollView>
    )
}

export default FilterOverview