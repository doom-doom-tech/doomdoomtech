import {StyleSheet, View} from 'react-native'
import {useCallback, useEffect, useMemo, useState} from "react";
import {palette, spacing} from "@/theme";
import useGlobalUserContext from "@/features/user/hooks/useGlobalUserContext";
import List, {ListRenderItemPropsInterface} from "@/common/components/List";
import Track from "@/features/track/classes/Track";
import TrackContextProvider from "@/features/track/context/TrackContextProvider";
import TrackRow from "@/features/track/components/track-row/TrackRow";
import {useCreateNoteStoreSelectors} from "@/features/note/store/create-note";
import Text from "@/common/components/Text";
import Input from "@/common/components/inputs/Input";
import useTracks from "@/features/track/hooks/useTracks";
import _ from "lodash";
import {useSearchHistoryStoreAdd, useSearchHistoryStoreHistory, useSearchHistoryStoreRemove} from "@/features/search/store/history";
import SearchHistoryItem from "@/features/search/components/SearchHistoryItem";

interface CreateNoteTrackProps {

}

const CreateNoteTracks = ({}: CreateNoteTrackProps) => {

    const track = useCreateNoteStoreSelectors.track()
    const user = useGlobalUserContext()

    const [query, setQuery] = useState<string>('')

    const tracksQuery = useTracks({ query })

    const searchHistoryItems = useSearchHistoryStoreHistory()
    const addSearchHistoryQuery = useSearchHistoryStoreAdd()
    const removeSearchHistoryQuery = useSearchHistoryStoreRemove()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                flex: 1,
                gap: spacing.s,
                paddingVertical: spacing.m
            },
            title: {
                fontWeight: 'bold',
                fontSize: 18,
                color: palette.offwhite,
                paddingHorizontal: spacing.m
            },
            listContainer: {
                flexGrow: 1,
                flexShrink: 1,
            },
            history: {
                gap: spacing.s,
            }
        });
    }, []);

    const selectedTrack = useCreateNoteStoreSelectors.track()
    const setCreateNoteState = useCreateNoteStoreSelectors.setState()

    const selected = useCallback((t: Track) => {
        return selectedTrack?.getID() === t.getID()
    }, [selectedTrack])

    const selectTrack = useCallback((t: Track) => {
        if(selected(t)) return setCreateNoteState({ track: null })
        setCreateNoteState({ track: t })
    }, [selected])

    const RenderItem = useCallback(({item, index}: ListRenderItemPropsInterface<Track>) => (
        <TrackContextProvider track={item}>
            <TrackRow selectable selected={selected(item)} onSelect={selectTrack} type={'no-action'} />
        </TrackContextProvider>
    ), [selected, selectTrack])

    const debouncedQueryUpdate = useCallback(
        _.debounce((query: string) => {
            addSearchHistoryQuery(query)
        }, 2000), [])

    const handleChange = useCallback((query: string) => {
        setQuery(query)
        debouncedQueryUpdate(query)
    }, [])

    useEffect(() => {
        return () => {
            debouncedQueryUpdate.cancel();
        };
    }, []);

    const removeHistoryEntry = useCallback((query: string) => {
        removeSearchHistoryQuery(query)
    }, [removeSearchHistoryQuery])

    return (
        <View style={styles.wrapper}>
            <Text style={styles.title}>
                Add a track
            </Text>
            <Input
                value={query}
                onClear={() =>setQuery('')}
                onChangeText={handleChange}
                placeholder={"Search for a track"}
                clearButtonMode={'while-editing'}
            />

            { Boolean(searchHistoryItems.length) && query === '' && (
                <View style={styles.history}>
                    {searchHistoryItems.slice(0, 20).map((item) => (
                        <SearchHistoryItem label={item} onSelect={setQuery} onRemove={removeHistoryEntry} />
                    ))}
                </View>
            )}

            { Boolean(query) && (
                <List
                    infinite
                    query={tracksQuery}
                    renderItem={RenderItem}
                />
            )}
        </View>
    );
}

export default CreateNoteTracks