import TrackPlayer, {Event} from 'react-native-track-player';

const MediaService = async () => {
    TrackPlayer.addEventListener(Event.RemoteSeek, async (event) => {
        await TrackPlayer.seekTo(event.position)
    })

    TrackPlayer.addEventListener(Event.RemotePause, async () => {
        await TrackPlayer.pause()
    })

    TrackPlayer.addEventListener(Event.RemotePlay, async () => {
        await TrackPlayer.play()
    })

    TrackPlayer.addEventListener(Event.RemoteNext, async () => {
        await TrackPlayer.skipToNext()
    })

    TrackPlayer.addEventListener(Event.RemotePrevious, async () => {
        await TrackPlayer.skipToPrevious()
    })
}

export default MediaService;