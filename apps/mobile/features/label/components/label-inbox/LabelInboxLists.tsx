import {ScrollView, StyleSheet} from 'react-native'
import {useMemo} from "react";

import {spacing} from "@/theme";
import BestRatedTracks from "@/features/charts/components/BestRatedTracks";
import MostListenedTracks from "@/features/charts/components/MostListenedTracks";
import MostPopularTracks from "@/features/charts/components/MostPopularTracks";

const LabelInboxLists = () => {

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                paddingBottom: 400,
                paddingLeft: spacing.m,
            },
        })
    }, []);

    return(
        <ScrollView contentContainerStyle={styles.wrapper}>
            <BestRatedTracks />
            <MostListenedTracks />
            <MostPopularTracks />
        </ScrollView>
    )
}

export default LabelInboxLists