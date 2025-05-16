import Track from "@/features/track/classes/Track";
import {Track as NativeTrack} from "react-native-track-player"

export const trackToNative = (track: Track): NativeTrack => ({
    id: track.getID(),
    title: track.getTitle(),
    url: track.getAudioSource() as string,
    artist: track.getMainArtist().getUsername(),
    artwork: track.getCoverSource() || 'https://play-lh.googleusercontent.com/Cg5EcFiy1xg6VIt_Q2gnp8rvRjVM-r7Pz2Zvw6aCPYD-wsky8RuEU58t58ktA4HAvj8',
});