import {StyleSheet, View} from "react-native";
import {palette, spacing} from "@/theme";
import Text from "@/common/components/Text";
import Key from "@/assets/icons/Key";
import Drums from "@/assets/icons/Drums";
import Clock from "@/assets/icons/Clock";
import Agenda from "@/assets/icons/Agenda";
import {useTrackContext} from "@/features/track/context/TrackContextProvider";
import {useProgress} from "react-native-track-player";
import {secondsToTimeFormat} from "@/common/services/utilities";

const NowPlayingMetrics = () => {

    const track = useTrackContext()
    const progress = useProgress()

    const styles = StyleSheet.create({
        wrapper: {
            gap: spacing.m,
            padding: spacing.m,
            margin: spacing.m,
            backgroundColor: palette.granite.concat('20'),
        },
        title: {
            fontWeight: 'bold',
            color: palette.offwhite,
        },
        items: {
            flexDirection: 'row',
            flexWrap: 'wrap',
        },
        item: {
            width: '50%',
            marginBottom: spacing.m,
        },
        head: {
            gap: spacing.s,
            flexDirection: 'row',
            alignItems: 'center',
        },
        value: {
            fontSize: 18,
            color: palette.granite
        }
    })

    const items = [
        {
            icon: <Key />,
            title: 'Key',
            content: track.getMetadata()?.key ?? '-'
        },
        {
            icon: <Drums />,
            title: 'BPM',
            content: track.getMetadata()?.bpm ?? '-'
        },
        {
            icon: <Clock />,
            title: 'Playtime',
            content: secondsToTimeFormat(Math.floor(progress.duration))
        },
        {
            icon: <Agenda />,
            title: 'Release date',
            content: track.getReleaseDate()
        },
    ]

    return(
        <View style={styles.wrapper}>
            <Text style={styles.title}>
                Track information
            </Text>
            <View style={styles.items}>
                { items.map(item => (
                    <View style={styles.item}>
                        <View style={styles.head}>
                            {item.icon}
                            <Text style={styles.title}>{item.title}</Text>
                        </View>
                        <Text style={styles.value}>
                            {item.content}
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    )
}

export default NowPlayingMetrics