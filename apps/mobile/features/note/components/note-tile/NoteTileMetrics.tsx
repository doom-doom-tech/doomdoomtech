import {StyleSheet, View} from 'react-native'
import {useMemo} from "react";
import NoteMetrics from "@/features/note/components/NoteMetrics";
import {spacing} from "@/theme";

interface NoteTileMetricsProps {

}

const NoteTileMetrics = ({}: NoteTileMetricsProps) => {

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                paddingHorizontal: spacing.m
            },
        })
    }, []);

    return(
        <View style={styles.wrapper}>
            <NoteMetrics />
        </View>
    )
}

export default NoteTileMetrics