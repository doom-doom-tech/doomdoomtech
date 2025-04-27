import {StyleSheet} from 'react-native'
import {Fragment, useMemo} from "react";
import {LinearGradient} from "expo-linear-gradient";
import {useNoteContext} from "@/features/note/context/NoteContextProvider";

interface NoteGradientBackgroundProps {

}

const NoteGradientBackground = ({}: NoteGradientBackgroundProps) => {

    const note = useNoteContext()

    const styles = useMemo(() => {
        return StyleSheet.create({
            gradient: {
                ...StyleSheet.absoluteFillObject,
                borderRadius: 4,
                opacity: 0.6
            }
        })
    }, []);

    if(!note.looped()) return <Fragment />

    return(
        <LinearGradient colors={['#CE5846', '#501D5F']} style={styles.gradient} />
    )
}

export default NoteGradientBackground