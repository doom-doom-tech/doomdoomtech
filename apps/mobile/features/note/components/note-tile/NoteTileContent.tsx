import {StyleSheet, View} from 'react-native'
import {useMemo} from "react";
import NoteText from "@/features/note/components/NoteText";

interface NoteTileContentProps {

}

const NoteTileContent = ({}: NoteTileContentProps) => {

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
        })
    }, []);

    return(
        <View style={styles.wrapper}>
            <NoteText maxLength={50} />
        </View>
    )
}

export default NoteTileContent