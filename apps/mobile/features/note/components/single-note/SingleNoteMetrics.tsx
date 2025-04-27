import {StyleSheet, View} from 'react-native'
import {useMemo} from "react";
import NoteMetrics from "@/features/note/components/NoteMetrics";
import {spacing} from "@/theme";

interface SingleNoteMetricsProps {

}

const SingleNoteMetrics = ({}: SingleNoteMetricsProps) => {

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

export default SingleNoteMetrics