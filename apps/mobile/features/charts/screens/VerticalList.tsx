import { StyleSheet, View } from 'react-native'
import { Fragment, useCallback, useMemo } from "react";
import useMostPopularTracks from "@/features/track/hooks/useMostPopularTracks";
import useBestRatedTracks from "@/features/track/hooks/useBestRatedTracks";
import useMostListenedTracks from "@/features/track/hooks/useMostListenedTracks";
import { useLocalSearchParams } from "expo-router";
import { useFilterStoreSelectors } from "@/features/filter/store/filter";
import useUserLatest from "@/features/user/hooks/useUserLatest";
import UserContextProvider from "@/features/user/context/UserContextProvider";
import UserRow from "@/features/user/components/user-row/UserRow";
import List, { ListRenderItemPropsInterface } from "@/common/components/List";
import User from "@/features/user/classes/User";
import Track from "@/features/track/classes/Track";
import TrackContextProvider from "@/features/track/context/TrackContextProvider";
import useNoteLatest from "@/features/note/hooks/useNoteLatest";
import TrackRow from "@/features/track/components/track-row/TrackRow";
import Screen from "@/common/components/Screen";
import Header from "@/common/components/header/Header";
import FilterIcon from "@/features/filter/components/FilterIcon";
import Note from "@/features/note/classes/Note";
import FeedNote from "@/features/note/components/feed-note/FeedNote";
import NoteContextProvider from "@/features/note/context/NoteContextProvider";
import useUserTopPicks from "@/features/user/hooks/useUserTopPicks";
import useUserNotes from "@/features/user/hooks/useUserNotes";
import { spacing } from "@/theme";
import useLatestTracks from "@/features/track/hooks/useLatestTracks";
import useLabelsLatest from "@/features/label/hooks/useLabelsLatest";
import LabelContextProvider from "@/features/label/context/LabelContextProvider";
import Label from "@/features/label/classes/Label";
import LabelRow from "@/features/user/components/label-row/LabelRow";
import useLatestVideos from "@/features/track/hooks/useLatestVideos";
import Queueable from '@/common/components/Queueable';

const QUERY_MAP = {
    userNotes: useUserNotes,
    latestNotes: useNoteLatest,
    latestArtists: useUserLatest,
    latestLabels: useLabelsLatest,
    latestVideos: useLatestVideos,
    userTopPicks: useUserTopPicks,
    latestReleases: useLatestTracks,
    bestRatedTracks: useBestRatedTracks,
    mostPopularTracks: useMostPopularTracks,
    mostListenedTracks: useMostListenedTracks,
}

const TITLES = {
    userNotes: 'Notes',
    latestNotes: 'Latest notes',
    userTopPicks: 'User Top Picks',
    latestArtists: 'Latest artists',
    latestVideos: 'Latest videos',
    latestLabels: 'Latest labels',
    latestReleases: 'Latest releases',
    bestRatedTracks: 'Best rated',
    mostPopularTracks: 'Most popular',
    mostListenedTracks: 'Most listened',
}

interface VerticalListProps {

}

const VerticalList = ({ }: VerticalListProps) => {

    const user = useFilterStoreSelectors.user()
    const tag = useFilterStoreSelectors.label()
    const period = useFilterStoreSelectors.period()
    const subgenre = useFilterStoreSelectors.subgenre()
    const genre = useFilterStoreSelectors.genre()

    const { type } = useLocalSearchParams<{ type: keyof typeof QUERY_MAP }>()

    const query = QUERY_MAP[type]({
        period: period.value,
        genre: genre?.getID() ?? null,
        subgenre: subgenre?.getID() ?? null,
        query: null,
        userID: user?.getID() as any
    });

    const renderItem = useCallback(({ item, index }: ListRenderItemPropsInterface<User | Track | Note | Label>) => {
        switch (item.getType()) {
            case "User": return (
                <UserContextProvider user={item as User} key={item.getID()}>
                    <UserRow type={'follow'} />
                </UserContextProvider>
            )

            case "Label": return (
                <LabelContextProvider label={item as Label} key={item.getID()}>
                    <LabelRow type={'follow'} />
                </LabelContextProvider>
            )

            case "Track": return (
                <TrackContextProvider track={item as Track} key={item.getID()}>
                    <TrackRow numbered index={index + 1} type={'options'} />
                </TrackContextProvider>
            )

            case "Note": return (
                <NoteContextProvider note={item as Note} key={item.getID() + index}>
                    <FeedNote key={item.getID() + index} />
                </NoteContextProvider>
            )

            default: return <Fragment />
        }
    }, [])

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                gap: spacing.s,
            },
            container: {
                paddingBottom: 400
            }
        })
    }, []);

    const RightComponent = useCallback(() => (
        <FilterIcon available={['genre', 'label', 'period', 'subgenre']} />
    ), [])

    return (
        <Screen>
            <View style={styles.wrapper}>
                <Header
                    title={TITLES[type]}
                    RightComponent={RightComponent}
                />
                <Queueable query={query as any}>
                    <List
                        <User | Track | Note>
                        infinite
                        renderItem={renderItem}
                        query={query as any}
                        contentContainerStyle={styles.container}
                    />
                </Queueable>

            </View>
        </Screen>
    )
}

export default VerticalList