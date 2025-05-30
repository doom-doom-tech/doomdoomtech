import {StyleSheet, useWindowDimensions, View} from 'react-native'
import {useMemo} from "react";
import TrackCover from '../TrackCover';
import TrackInformation from '../TrackInformation';
import TopPicksTrigger from "@/features/list/components/TopPicksTrigger";
import {spacing} from "@/theme";

interface NowPlayingInformationProps {

}

const NowPlayingInformation = ({}: NowPlayingInformationProps) => {

    const { width } = useWindowDimensions()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                paddingHorizontal: spacing.m,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: -100,
                marginBottom: spacing.m,
            },
            left: {
                gap: 16,
                maxWidth: width / 2,
                flexDirection: 'row',
                alignItems: 'center',
            }
        })
    }, []);

    return(
        <View style={styles.wrapper}>
            <View style={styles.left}>
                <TrackCover size={100} />
                <TrackInformation truncate />
            </View>
            <View>
                <TopPicksTrigger />
            </View>
        </View>
    )
}

export default NowPlayingInformation