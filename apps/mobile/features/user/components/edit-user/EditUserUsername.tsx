import {StyleSheet, View} from 'react-native'
import {useCallback, useMemo} from "react";
import Input from "@/common/components/inputs/Input";
import {useEditUserStoreSelectors} from "@/features/user/store/edit-user";
import useGlobalUserContext from "@/features/user/hooks/useGlobalUserContext";

interface EditUserUsernameProps {

}

const EditUserUsername = ({}: EditUserUsernameProps) => {

    const currentUser = useGlobalUserContext()

    const values = useEditUserStoreSelectors.values()
    const setEditUserState = useEditUserStoreSelectors.setState()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
        })
    }, []);

    const handleChange = useCallback((value: string) => {
        setEditUserState({ username: value })
    }, [])

    return(
        <View style={styles.wrapper}>
            <Input defaultValue={currentUser?.getUsername()} placeholder={"Username"} onChangeText={handleChange} />
        </View>
    )
}

export default EditUserUsername