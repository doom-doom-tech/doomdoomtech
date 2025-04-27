import {DeviceEventEmitter, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useCallback, useMemo, useRef, useState} from "react";
import {NoteAttachmentInterface} from "@/features/note/types";
import {Image} from "expo-image";
import {ResizeMode, Video} from 'expo-av';
import Mute from "@/assets/icons/Mute";
import {palette} from "@/theme";
import Unmute from "@/assets/icons/Unmute";
import useEventListener from "@/common/hooks/useEventListener";
import {useFocusEffect} from "expo-router";

interface FeedNoteMediaProps {
    size: number
    attachment: NoteAttachmentInterface
}

const NoteMedia = ({ size, attachment }: FeedNoteMediaProps) => {

    const videoReference = useRef<Video>(null)

    const [muted, setMuted] = useState<boolean>(true)

    const styles = useMemo(() => {
        return StyleSheet.create({
            media: {
                position: 'relative',
                objectFit: 'cover',
                width: size,
                height: size,
            },
            unmute: {
                position: 'absolute',
                borderRadius: 4,
                padding: 8,
                backgroundColor: palette.darkgrey,
                bottom: 8,
                right: 8
            }
        });
    }, []);

    const handleToggleMute = useCallback(async () => {
        if (!videoReference.current) return;

        // mute all others playing
        DeviceEventEmitter.emit('notes:mute')

        try {
            const newMutedState = !muted;
            await videoReference.current.setIsMutedAsync(newMutedState);
            setMuted(newMutedState);
        } catch (error) {
            console.error('Error toggling mute:', error);
        }
    }, [muted]);

    const forceMute = useCallback(async () => {
        videoReference.current && await videoReference.current.setIsMutedAsync(true);
        setMuted(true);
    }, [])

    useEventListener('notes:mute', forceMute)

    useFocusEffect(
        useCallback(() => {
            return () => {
                forceMute();
            };
        }, [forceMute])
    );

    if (attachment.type === "Image") {
        return (
            <Image source={attachment.url} style={styles.media} />
        );
    }

    return (
        <View style={styles.media}>
            <Video
                ref={videoReference}
                source={{ uri: attachment.url }}
                resizeMode={ResizeMode.COVER}
                style={styles.media}
                isMuted={true}
                isLooping={true}
                shouldPlay={true}
                useNativeControls={false}
            />

            <TouchableOpacity style={styles.unmute} onPress={handleToggleMute}>
                { muted
                    ? <Mute color={palette.offwhite} />
                    : <Unmute color={palette.offwhite} />
                }

            </TouchableOpacity>
        </View>
    );
};

export default NoteMedia;