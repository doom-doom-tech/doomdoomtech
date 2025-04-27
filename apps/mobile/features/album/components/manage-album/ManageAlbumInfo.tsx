import {StyleSheet, TextInput, View} from 'react-native'
import {useCallback, useMemo, useRef, useState} from "react";
import Input from "@/common/components/inputs/Input";
import {palette, spacing} from "@/theme";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {useManageAlbumStoreSelectors} from "@/features/album/store/manage-album";
import {formatReadableDate} from "@/common/services/utilities";


interface ManageAlbumNameProps {

}

const ManageAlbumInfo = ({}: ManageAlbumNameProps) => {

    const name = useManageAlbumStoreSelectors.name()
    const releaseDate = useManageAlbumStoreSelectors.release()
    const setManageAlbumState = useManageAlbumStoreSelectors.setState()

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                gap: spacing.m,
                padding: spacing.m,
                borderBottomWidth: 1,
                borderColor: palette.granite
            },
        })
    }, []);

    const dateInputReference = useRef<TextInput>()

    const triggerDateSheet = useCallback(() => {
        setDatePickerVisibility(true)
        dateInputReference.current?.blur()
    }, [])

    const handleChangeAlbumName = useCallback((name: string) => {
        setManageAlbumState({ name })
    }, [])

    const handleConfirmReleaseDate = useCallback((date: Date) => {
        setManageAlbumState({ release: new Date(date) })
        setDatePickerVisibility(false)
    }, [])

    return(
        <View style={styles.wrapper}>
            <Input
                value={name}
                placeholder={'Album name'}
                onChangeText={handleChangeAlbumName}
            />
            <Input
                value={formatReadableDate(releaseDate)}
                label={"Set a release date for your album"}
                ref={dateInputReference}
                placeholder={'Release date (optional)'}
                onFocus={triggerDateSheet}
            />

            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="datetime"
                onConfirm={handleConfirmReleaseDate}
                onCancel={() => setDatePickerVisibility(false)}
            />
        </View>
    )
}

export default ManageAlbumInfo