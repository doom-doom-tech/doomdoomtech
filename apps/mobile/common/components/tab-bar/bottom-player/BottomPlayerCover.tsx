import {StyleSheet, View} from 'react-native'
import {useMemo} from "react";
import {useMediaStoreSelectors} from "@/common/store/media";
import {Image} from "expo-image";
import {useVideoPlayer, VideoView} from "expo-video";
import _ from "lodash";

interface BottomPlayerCoverProps {

}

const BottomPlayerCover = ({}: BottomPlayerCoverProps) => {

    const current = useMediaStoreSelectors.current()

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