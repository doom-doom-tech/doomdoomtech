import {StyleSheet, View} from 'react-native'
import {useCallback, useMemo} from "react";
import Input from "@/common/components/inputs/Input";
import {palette} from "@/theme";
import {useCreateNoteStoreSelectors} from "@/features/note/store/create-note";

interface CreateNoteInputProps {

}

const CreateNoteInput = ({}: CreateNoteInputProps) => {

    const setCreateNoteState = useCreateNoteStoreSelectors.setState()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
            input: {
                height: 100,
                borderColor: palette.transparent,
                fontSize: 18,
                fontWeight: '200'
            }
        })
    }, []);

    const handleChange = useCallback((content: string) => {
        setCreateNoteState({ content })
    }, [])

    return(
        <View style={styles.wrapper}>
            <Input
                multiline
                maxLength={200}
                numberOfLines={0}
                inputStyle={styles.input}
                onChangeText={handleChange}
            />
        </View>
    )
}

export default CreateNoteInput