import {StyleSheet, View} from 'react-native'
import {useCallback, useMemo} from "react";
import Button from "@/common/components/buttons/Button";
import Copy from "@/assets/icons/Copy";
import {useShareStoreSelectors} from "@/features/share/store/share";
import {palette, spacing} from "@/theme";
import * as Clipboard from 'expo-clipboard';
import {wait} from "@/common/services/utilities";
import {router} from "expo-router";
import Toast from "react-native-root-toast";
import {TOASTCONFIG} from "@/common/constants";
import Text from "@/common/components/Text";

interface ShareActionsProps {

}

const ShareActions = ({}: ShareActionsProps) => {

    const entity = useShareStoreSelectors.entity()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
        })
    }, []);

    const handleCopyEntityLink = useCallback(async () => {
        if(!entity) return

        try {
            // Use the new shorter URL format
            await Clipboard.setStringAsync(`https://doomdoom.tech/s/${entity.getID()}`)
            router.back()
            await wait(200)
            Toast.show('Track link copied', TOASTCONFIG.success)
        } catch (error: any) {
            Toast.show('Error copying the link', TOASTCONFIG.error)
        }
    }, [entity])

    return(
        <View style={styles.wrapper}>
            <Button fill={'olive'} label={"Copy link"} callback={handleCopyEntityLink} icon={<Copy color={palette.black} />} />
        </View>
    )
}

export default ShareActions
