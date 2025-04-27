import {StyleSheet, Text, View} from 'react-native';
import {useMemo} from "react";
import Key from "@/assets/icons/Key";
import {palette, spacing, styling} from "@/theme";
import Drums from "@/assets/icons/Drums";
import {useTrackContext} from "@/features/track/context/TrackContextProvider";
import FlameFilled from "@/assets/icons/FlameFilled";
import Play from "@/assets/icons/Play";
import _ from 'lodash';

interface SingleTrackMetricsProps {}

const SingleTrackMetrics = ({}: SingleTrackMetricsProps) => {
    const track = useTrackContext();

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                marginHorizontal: spacing.m,
                paddingVertical: spacing.m,
                borderTopWidth: 2,
                borderBottomWidth: 2,
                borderColor: palette.granite,
                flexDirection: 'row',
                flexWrap: 'wrap'
            },
            item: {
                width: '50%',
                gap: spacing.s,
                marginBottom: spacing.m,
            },
            value: {
                paddingLeft: spacing.s,
                color: palette.granite,
            }
        });
    }, []);

    const metrics = useMemo(() => [
        {
            icon: <Key />,
            label: 'Key',
            value: track.getMetadata()?.key ?? '-'
        },
        {
            icon: <Drums />,
            label: 'BPM',
            value: track.getMetadata()?.bpm ?? '-'
        },
        {
            icon: <FlameFilled />,
            label: 'Likes',
            value: String(track.getLikesCount())
        },
        {
            icon: <Play />,
            label: 'Plays',
            value: String(_.get(track.getMetrics(), 'total_plays'))
        }
    ], [track]);

    return (
        <View style={styles.wrapper}>
            {metrics.map((metric, index) => (
                <View key={index} style={styles.item}>
                    <View style={styling.row.s}>
                        {metric.icon}
                        <Text style={styling.text.light}>
                            {metric.label}
                        </Text>
                    </View>
                    <Text style={styles.value}>
                        {metric.value}
                    </Text>
                </View>
            ))}
        </View>
    );
};

export default SingleTrackMetrics;