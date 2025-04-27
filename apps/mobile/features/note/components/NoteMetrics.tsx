import {StyleSheet, View} from 'react-native'
import {useCallback, useMemo, useState} from "react";
import IconLabel from "@/common/components/icon/IconLabel";
import Comments from "@/assets/icons/Comments";
import {useNoteContext} from "@/features/note/context/NoteContextProvider";
import Loop from "@/assets/icons/Loop";
import FlameFilled from "@/assets/icons/FlameFilled";
import Flame from "@/assets/icons/Flame";
import {palette, spacing} from "@/theme";
import useLike from "@/features/like/hooks/useLike";
import useUnlike from "@/features/like/hooks/useUnlike";
import {router} from "expo-router";
import {useNoteStoreSelectors} from "@/features/note/store/note";
import {useAlgoliaEvents} from "@/common/hooks/useAlgoliaEvents";

interface NoteActionsProps {

}

const NoteMetrics = ({}: NoteActionsProps) => {

    const note = useNoteContext()

    const likeMutation = useLike()
    const unlikeMutation = useUnlike()

    const setNoteState = useNoteStoreSelectors.setState()

    const { likeNote } = useAlgoliaEvents()

    const [liked, setLiked] = useState(note.liked());
    const [likesCount, setLikesCount] = useState(note.getLikesCount());
    const [looped, setLooped] = useState(note.looped());
    const [loopsCount, setLoopsCount] = useState(note.getLoopsCount());

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
            },
            actions: {
                flexDirection: "row",
                gap: spacing.m,
            },
        });
    }, []);

    const handleLike = useCallback(() => {

        likeNote(note.getID())

        setLiked((prevLiked) => {
            const newLiked = !prevLiked;

            newLiked
                ? likeMutation.mutate({
                    entity: 'Note',
                    entityID: note.getID() })
                : unlikeMutation.mutate({
                    entity: 'Note',
                    entityID: note.getID()
                })

            setLikesCount((prevCount) => (newLiked ? prevCount + 1 : prevCount - 1));
            return newLiked;
        });
    }, [note]);

    const handleLoop = useCallback(() => {
        setNoteState({ note })
        router.push('/loop-note')
    }, [note]);

    const handleTriggerComments = useCallback(() => {
        router.push(`/(sheets)/comments/Note/${note.getID()}`)
    }, [note])

    const likeIcon = useMemo(
        () => (liked ? <FlameFilled color={palette.rose} /> : <Flame color={palette.offwhite} />),
        [liked]
    );

    return(
        <View style={styles.wrapper}>
            <View style={styles.actions}>
                <IconLabel
                    icon={likeIcon}
                    callback={handleLike}
                    label={likesCount.toString()}
                />

                <IconLabel
                    icon={<Comments />}
                    callback={handleTriggerComments}
                    label={note.getCommentsCount().toString()}
                />

                { note.looped() === false && (
                    <IconLabel
                        icon={<Loop />}
                        callback={handleLoop}
                        label={note.getLoopsCount().toString()}
                    />
                )}
            </View>
        </View>
    )
}

export default NoteMetrics