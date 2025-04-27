import {StyleSheet, View} from 'react-native'
import {useMemo} from "react";
import Text from "@/common/components/Text";
import {useCreateNoteStoreSelectors} from "@/features/note/store/create-note";
import {palette, spacing} from "@/theme";

interface CreateNoteHeaderProps {

}

const CreateNoteHeader = ({}: CreateNoteHeaderProps) => {

    const content = useCreateNoteStoreSelectors.content()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                paddingHorizontal: spacing.m,
                flexDirection: 'row',
                justifyContent: 'space-between',
            },
            title: {
                color: palette.offwhite,
                fontSize: 18,
                fontWeight: 'bold'
            },
            subtitle: {
                color: palette.granite,
                fontWeight: '200'
            },
        })
    }, []);

    return(
        <View style={styles.wrapper}>
            <Text style={styles.title}>
                What's on your mind?
            </Text>
            <Text style={styles.subtitle}>
                {content.length}/200
            </Text>
        </View>
    )
}

export default CreateNoteHeader