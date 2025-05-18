import {Dimensions, StyleSheet, TouchableOpacity} from 'react-native'
import {useCallback, useMemo} from "react";
import {useNoteContext} from "@/features/note/context/NoteContextProvider";
import NoteTileHeader from "@/features/note/components/note-tile/NoteTileHeader";
import {spacing} from "@/theme";
import {LinearGradient} from "expo-linear-gradient";
import {router} from "expo-router";
import NoteTileContent from "@/features/note/components/note-tile/NoteTileContent";
import NoteTileMetrics from "@/features/note/components/note-tile/NoteTileMetrics";
import {useAlgoliaEvents} from "@/common/hooks/useAlgoliaEvents";

const { width: screenWidth } = Dimensions.get("window");

const NoteTile = () => {

    const note = useNoteContext()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                gap: spacing.s,
                paddingVertical: spacing.m,
                width: screenWidth - 50,
                height: 200
            },
            background:  {
                ...StyleSheet.absoluteFillObject,
                opacity: 0.2
            }
        })
    }, []);

    const { viewItem } = useAlgoliaEvents()

    const handleRouteNote = useCallback(() => {
        viewItem(note.getID(), 'note')
        router.push(`/note/${note.getID()}`)
    }, [])

    return(
        <TouchableOpacity style={styles.wrapper} activeOpacity={0.5} onPress={handleRouteNote}>
            <LinearGradient colors={['#CE5846', '#501D5F']} style={styles.background} />
            <NoteTileHeader />
            <NoteTileContent />
            <NoteTileMetrics />
        </TouchableOpacity>
    )
}

export default NoteTile