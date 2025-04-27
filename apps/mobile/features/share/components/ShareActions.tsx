import {StyleSheet, View} from 'react-native'
import {useCallback, useMemo} from "react";
import Button from "@/common/components/buttons/Button";
import Copy from "@/assets/icons/Copy";
import {useShareStoreSelectors} from "@/features/share/store/share";
import {palette} from "@/theme";
import * as Clipboard from 'expo-clipboard';
import {wait} from "@/common/services/utilities";
import {router} from "expo-router";
import Toast from "react-native-root-toast";
import {TOASTCONFIG} from "@/common/constants";

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
            await Clipboard.setStringAsync(`https://ddt-web.expo.app/share?id=${entity.getID()}&title=${entity.getTitle()}&artist=${entity.getMainArtist().getUsername()}&image=${entity.getCoverSource()}`)
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