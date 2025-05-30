import {StyleSheet, useWindowDimensions, View} from 'react-native'
import {useMemo} from "react";
import {useShareStoreSelectors} from "@/features/share/store/share";
import {Image} from "expo-image";
import Text from "@/common/components/Text";
import {palette} from "@/theme";
import { useVideoPlayer, VideoView } from 'expo-video';

interface ShareEntityProps {

}

const ShareEntity = ({}: ShareEntityProps) => {

    const { width: size } = useWindowDimensions()

    const entity = useShareStoreSelectors.entity()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                justifyContent: 'center',
                alignItems: 'center'
            },
            image: {
                width: 250,
                height: 250,
            },
            title: {
                width: 250,
                fontSize: 24,
                textAlign: 'center',
                color: palette.offwhite
            }
        })
    }, []);

    const player = useVideoPlayer(entity?.getVideoSource(), player => {
        player.staysActiveInBackground = false
        player.allowsExternalPlayback = false
        player.loop = true
        player.muted = true

        player.play()
    })

    if(entity?.getVideoSource()) return(
        <View style={styles.wrapper}>
            <VideoView player={player} style={styles.image} contentFit={'cover'} />
        </View>
    )

    return(
        <View style={styles.wrapper}>
            <Image style={styles.image} source={entity?.getCoverSource()} />
            <Text style={styles.title}>
                { entity?.getTitle() }
            </Text>
        </View>
    )
}

export default ShareEntity