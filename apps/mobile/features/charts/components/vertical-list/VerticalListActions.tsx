import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {Fragment, useCallback, useMemo, useState} from 'react';
import Play from '@/assets/icons/Play';
import IconButton from '@/common/components/buttons/IconButton';
import {palette, spacing} from '@/theme';
import {InfiniteData} from '@tanstack/react-query';
import Track from '@/features/track/classes/Track';
import TrackPlayer, {AddTrack, State} from 'react-native-track-player';
import {useQueueStoreSelectors} from '@/common/store/queue';
import {useMediaStoreSelectors} from '@/common/store/media';
import {extractItemsFromInfinityQuery} from "@/common/services/utilities";
import User from "@/features/user/classes/User";
import Note from "@/features/note/classes/Note";
import Pause from "@/assets/icons/Pause";

interface VerticalListActionsProps {
    query: {
        data?: InfiniteData<{ data: Track[] }>;
        hasNextPage?: boolean;
        fetchNextPage: () => Promise<any>;
        isFetchingNextPage: boolean;
    };
}

const VerticalListActions = ({ query }: VerticalListActionsProps) => {

    const state = useMediaStoreSelectors.state()

    const [loading, setLoading] = useState<boolean>(false);
    const [loaded, setLoaded] = useState<boolean>(false);

    const setQueueState = useQueueStoreSelectors.setState();
    const setMediaState = useMediaStoreSelectors.setState();

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                paddingHorizontal: spacing.m,
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
            },
        });
    }, []);

    const getAllTracks = useCallback(() => {
        return extractItemsFromInfinityQuery<Track>(query.data)
    }, [query.data]);

    const fetchAllPages = useCallback(async () => {
        while (query.hasNextPage && !query.isFetchingNextPage) {
            await query.fetchNextPage();
        }
    }, [query.hasNextPage, query.isFetchingNextPage, query.fetchNextPage]);

    const handleReplaceQueue = useCallback(async () => {
        try {
            setLoading(true)

            // Optionally fetch all pages (if you want the full list)
            await fetchAllPages();

            // Get all tracks from fetched pages
            const tracks = getAllTracks();
            if (tracks.length === 0) return;

            // Format tracks for TrackPlayer
            const playerTracks = tracks.map<AddTrack>((track) => ({
                id: track.getID(),
                url: track.getAudioSource() as string,
                title: track.getTitle(),
                artist: track.getMainArtist().getUsername(),
                artwork: track.getCoverSource() || 'https://play-lh.googleusercontent.com/Cg5EcFiy1xg6VIt_Q2gnp8rvRjVM-r7Pz2Zvw6aCPYD-wsky8RuEU58t58ktA4HAvj8'
            }));

            // Reset TrackPlayer queue and add new tracks
            await TrackPlayer.reset();
            await TrackPlayer.add(playerTracks);
            await TrackPlayer.play();

            // Update Zustand queue store
            setQueueState({ queue: tracks });

            // Update media state
            setMediaState({ current: tracks[0], state: State.Playing });
        } catch (error) {
            console.error('Error replacing queue:', error);
        } finally {
            setLoaded(true)
            setLoading(false)
        }
    }, [getAllTracks, fetchAllPages, setQueueState, setMediaState]);

    const Icon = useMemo(() => {
        switch (true) {
            case loading: return <ActivityIndicator color={palette.offwhite} />; break;
            case loaded && state === State.Paused: return <Play />; break;
            case loaded && state === State.Playing: return <Pause />; break;
            default: return <Play />
        }
    }, [loaded, loading, state])

    const Callback = useCallback(async () => {
        switch (true) {
            case loaded && state === State.Paused: await TrackPlayer.play(); break;
            case loaded && state === State.Playing: await TrackPlayer.pause(); break;
            default: await handleReplaceQueue(); break;
        }
    }, [loading, loaded, state, handleReplaceQueue])

    if(extractItemsFromInfinityQuery<Track | Note | User>(query.data).some(item => item.getType() !== 'Track'))
        return <Fragment />

    return (
        <View style={styles.wrapper}>
            <IconButton icon={Icon} fill={'rose'} callback={Callback} />
        </View>
    );
};

export default VerticalListActions;