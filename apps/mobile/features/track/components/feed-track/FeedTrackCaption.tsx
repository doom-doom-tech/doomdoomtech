import {StyleSheet, Text, View} from 'react-native'
import {Fragment, useMemo} from "react";
import {useTrackContext} from "@/features/track/context/TrackContextProvider";
import {palette, spacing} from "@/theme";

interface FeedTrackCaptionProps {

}

const FeedTrackCaption = ({}: FeedTrackCaptionProps) => {

    const track = useTrackContext()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                paddingHorizontal: spacing.m,
                gap: spacing.xs
            },
            text: {
                gap: spacing.xs
            },
            username: {
                fontWeight: 800,
                color: palette.offwhite
            },
            caption: {
                fontWeight: 400,
                color: palette.granite
            }
        })
    }, []);

    if(!track.getCaption()) return <Fragment />

    return(
        <View style={styles.wrapper}>
            <Text style={styles.text}>
                <Text style={styles.username}>{track.getMainArtist().getUsername()}</Text>
                <Text style={styles.username}>{'  '}</Text>
                <Text style={styles.caption}>{track.getCaption()}</Text>
            </Text>
        </View>
    )
}

export default FeedTrackCaption