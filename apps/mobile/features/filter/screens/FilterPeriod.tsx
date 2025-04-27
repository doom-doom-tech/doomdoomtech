import {ScrollView, StyleSheet, View} from 'react-native'
import {useCallback, useMemo} from "react";
import Header from "@/common/components/header/Header";
import RadioConsent from "@/common/components/consent/RadioConsent";
import {FilterPeriod as FilterPeriodType, useFilterStoreSelectors} from "@/features/filter/store/filter";
import Text from "@/common/components/Text";
import {palette, spacing} from "@/theme";
import _ from 'lodash';
import ActionText from "@/common/components/ActionText";
import {router} from "expo-router";

interface FilterPeriodProps {

}

export const periods = [
    {
        value: 24,
        label: "Today"
    },
    {
        value: 7,
        label: "Last week"
    },
    {
        value: 30,
        label: "Last month"
    },
    {
        value: 'infinite',
        label: "All time"
    },
] as Array<Record<string, FilterPeriodType | string>>

const FilterPeriod = ({}: FilterPeriodProps) => {

    const period = useFilterStoreSelectors.period()
    const setFilterState = useFilterStoreSelectors.setState()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
            label: {
                padding: spacing.m,
                color: palette.offwhite
            }
        })
    }, []);

    const handleSelectPeriod = useCallback((period: typeof periods[number]) =>  () => {
        setFilterState({ period })
    }, [])

    const RightComponent = useCallback(() => (
        <ActionText callback={router.back} label={"Save"} />
    ), [])

    return(
        <View style={styles.wrapper}>
            <Header title={"Period"} RightComponent={RightComponent} />
            <ScrollView>
                { _.map(periods, p => (
                    <RadioConsent value={p.value === period.value} callback={handleSelectPeriod(p)}>
                        <Text style={styles.label}>
                            {p.label}
                        </Text>
                    </RadioConsent>
                ))}
            </ScrollView>
        </View>
    )
}

export default FilterPeriod