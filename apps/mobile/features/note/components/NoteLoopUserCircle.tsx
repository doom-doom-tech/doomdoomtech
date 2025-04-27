import {StyleSheet, View} from 'react-native'
import {useMemo} from "react";
import {useNoteContext} from "@/features/note/context/NoteContextProvider";
import {Image} from "expo-image";
import Loop from "@/assets/icons/Loop";

interface NoteLoopUserCircleProps {

}

const NoteLoopUserCircle = ({}: NoteLoopUserCircleProps) => {

    const note = useNoteContext()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                position: 'relative'
            },
            image: {
                width: 24, height: 24,
                opacity: 0.5,
                borderRadius: 24
            },
            icon: {
                position: 'absolute',
                bottom: -8,
                left: -8
            }
        })
    }, []);

    return(
        <View style={styles.wrapper}>
            <Image source={note.getUser().getImageSource()} style={styles.image} />
            <View style={styles.icon}>
                <Loop />
            </View>
        </View>
    )
}

export default NoteLoopUserCircle