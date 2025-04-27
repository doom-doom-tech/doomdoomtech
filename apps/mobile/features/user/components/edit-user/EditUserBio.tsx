import {StyleSheet, View} from 'react-native'
import {useCallback, useMemo} from "react";
import Input from "@/common/components/inputs/Input";
import {useEditUserStoreSelectors} from "@/features/user/store/edit-user";
import {palette} from "@/theme";
import useGlobalUserContext from "@/features/user/hooks/useGlobalUserContext";

interface EditUserBioProps {

}

const EditUserBio = ({}: EditUserBioProps) => {

    const currentUser = useGlobalUserContext()

    const setEditUserState = useEditUserStoreSelectors.setState()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
            input: {
                height: 100,
                borderColor: palette.granite,
            }
        })
    }, []);

    const handleChange = useCallback((bio: string) => {
        setEditUserState({ bio })
    }, [setEditUserState])

    return(
        <View style={styles.wrapper}>
            <Input
                multiline
                maxLength={200}
                numberOfLines={0}
                inputStyle={styles.input}
                onChangeText={handleChange}
                defaultValue={currentUser?.getBio()}
                placeholder={"Write something about yourself"}
            />
        </View>
    )
}

export default EditUserBio