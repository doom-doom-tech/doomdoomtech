import {Dimensions, FlatList, StyleSheet, View} from 'react-native'
import {Fragment, useCallback, useMemo, useState} from "react";
import {useNoteContext} from "@/features/note/context/NoteContextProvider";
import {palette, spacing} from "@/theme";
import {NoteAttachmentInterface} from "@/features/note/types";
import {ListRenderItemPropsInterface} from "@/common/components/List";
import NoteMedia from "@/features/note/components/NoteMedia";
import {TODO} from "@/common/types/common";
import NoteTrack from "@/features/note/components/NoteTrack";

const { width: screenWidth } = Dimensions.get("window");

const NoteAttachments = () => {

    const note = useNoteContext()
    
    const [currentPage, setCurrentPage] = useState(0);

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                gap: spacing.m,
            },
            container: {

            },
            dotsContainer: {
                flexDirection: "row",
                justifyContent: "center",
            },
            dot: {
                width: 8,
                height: 8,
                borderRadius: 4,
                marginHorizontal: 4,
                backgroundColor: palette.granite, // Inactive dot color
            },
            activeDot: {
                backgroundColor: palette.olive, // Active dot color
            },
        })
    }, []);

    const RenderItem = useCallback(({item, index}: ListRenderItemPropsInterface<NoteAttachmentInterface>) => (
        <NoteMedia attachment={item} key={index} size={note.getMedia().length === 1 ? screenWidth - spacing.xl : 200} />
    ), [])

    const onScroll = useCallback((event: TODO) => {
        const newPage = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
        setCurrentPage(newPage);
    }, []);

    const Attachments = useCallback(() => {
        if(!note.getMedia().length) return <Fragment />
        return (
            <View style={styles.container}>
                <FlatList
                    <NoteAttachmentInterface>
                    horizontal
                    data={note.getMedia()}
                    renderItem={RenderItem}
                    onScroll={onScroll}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ gap: spacing.s, paddingLeft: spacing.m}}
                    keyExtractor={(item, index) => `${item}-${index}`}
                />
            </View>
        )
    }, [note])

    const Track = useCallback(() => {
        if(!note.getTrack()) return <Fragment />
        return <NoteTrack />
    }, [note])

    return(
        <View style={styles.wrapper}>
            <Attachments />
            <Track />
        </View>
    )
}

export default NoteAttachments