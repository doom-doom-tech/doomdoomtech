import {StyleSheet, View} from 'react-native'
import {useMemo} from "react";
import {Image} from "expo-image";
import {useVideoPlayer, VideoView} from "expo-video";
import _ from "lodash";
import useCurrentTrack from "@/features/track/hooks/useCurrentTrack";

interface BottomPlayerCoverProps {

}

const BottomPlayerCover = ({}: BottomPlayerCoverProps) => {

    const current = useCurrentTrack()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
            cover: {
                width: 50,
                height: 50
            }
        })
    }, []);

    const player = useVideoPlayer(_.invoke(current, 'getCoverSource'), player => {
        player.staysActiveInBackground = false
        player.allowsExternalPlayback = false
        player.loop = false
        player.muted = true
        player.play()
    })

    if(!current) return null;

    if(current.getMediaType() === 'audio') return (
        <View style={styles.wrapper}>
            <Image style={styles.cover} source={current.getCoverSource()} />
        </View>
    )

    if(current.getMediaType() === 'video') return (
        <View style={styles.wrapper}>
            <VideoView player={player} style={styles.cover} />
        </View>
    )
}

export default BottomPlayerCover