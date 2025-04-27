import {StyleSheet, View} from 'react-native'
import {useCallback, useMemo} from "react";
import SwitchConsent from "@/common/components/consent/SwitchConsent";
import Input from "@/common/components/inputs/Input";
import {palette, spacing} from "@/theme";
import {useUploadStoreSelectors} from "@/features/upload/store/upload";

interface UploadCompleteNoteProps {

}

const UploadCompleteNote = ({}: UploadCompleteNoteProps) => {

    const note = useUploadStoreSelectors.note()
    const { setState: setUploadState } = useUploadStoreSelectors.actions()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                gap: spacing.m,
                paddingHorizontal: spacing.m,
                paddingBottom: spacing.m,
                borderBottomWidth: 1,
                borderColor: palette.granite
            },
        })
    }, []);

    const handleNoteConsent = useCallback((active: boolean) => {
        setUploadState({ note: { active, content: note.content  } })
    }, [note])

    const handleChangeNoteContent = useCallback((value: string) => {
        setUploadState({ note: { active: note.active, content: value  } })
    }, [note])

    return(
        <View style={styles.wrapper}>
            <SwitchConsent
                label={"Create note for this release"}
                value={note.active}
                callback={handleNoteConsent}
            />

            <Input
                value={note.content}
                placeholder={"What's on your mind?"}
                onChangeText={handleChangeNoteContent}
            />
        </View>
    )
}

export default UploadCompleteNote