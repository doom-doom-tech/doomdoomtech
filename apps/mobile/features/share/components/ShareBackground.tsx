import {StyleSheet, useWindowDimensions, View} from 'react-native'
import {Fragment, useMemo} from "react";
import {BlurView} from "expo-blur";
import {useShareStoreSelectors} from "@/features/share/store/share";
import {Image} from "expo-image";
import { useVideoPlayer, VideoView } from 'expo-video';

interface ShareBackgroundProps {

}

const ShareBackground = ({}: ShareBackgroundProps) => {

    const { width: size, height } = useWindowDimensions()

    const entity = useShareStoreSelectors.entity()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                opacity: 0.5,
                width: size, height: height,
                ...StyleSheet.absoluteFillObject,
            },
            blurview: {
                position: 'absolute',
                width: size, height: height,
            },
            image: {
                width: size, height: height,
            }
        })
    }, []);

    if(!entity) return <Fragment />

    const player = useVideoPlayer(entity.getVideoSource(), player => {
        player.staysActiveInBackground = false
        player.allowsExternalPlayback = false
        player.loop = true
        player.muted = true

        player.play()
    })

    if(entity?.getVideoSource()) return(
        <View style={styles.wrapper}>
            <VideoView player={player} style={styles.image} contentFit={'cover'} />
            <BlurView tint={'dark'} intensity={100} style={styles.blurview} />
        </View>
    )

    return(
        <View style={styles.wrapper}>
            <Image source={entity.getCoverSource()} style={styles.image} />
            <BlurView tint={'dark'} intensity={100} style={styles.blurview} />
        </View>
    )
}

export default ShareBackground