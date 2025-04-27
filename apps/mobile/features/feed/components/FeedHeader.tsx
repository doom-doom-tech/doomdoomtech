import {StyleSheet, View} from 'react-native'
import {useMemo} from "react";
import Text from "@/common/components/Text";
import {palette, spacing} from "@/theme";
import {useFilterStoreSelectors} from "@/features/filter/store/filter";
import AlertBell from "@/features/alert/components/AlertBell";

const FeedHeader = () => {

    const setFilterState = useFilterStoreSelectors.setState()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: spacing.m
            },
            title: {
                fontSize: 24,
                fontWeight: 'bold',
                color: palette.offwhite,
            }
        })
    }, []);


    return(
        <View style={styles.wrapper}>
            <Text style={styles.title}>
                For you
            </Text>
            <AlertBell />
        </View>
    )
}

export default FeedHeader