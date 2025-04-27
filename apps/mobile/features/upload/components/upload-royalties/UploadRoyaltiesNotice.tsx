import {StyleSheet, View} from 'react-native'
import {Fragment, useMemo} from "react";
import {useUploadStoreSelectors} from "@/features/upload/store/upload";
import _ from "lodash";
import Text from "@/common/components/Text";
import {palette, spacing} from "@/theme";

interface UploadRoyaltiesNoticeProps {

}

const UploadRoyaltiesNotice = ({}: UploadRoyaltiesNoticeProps) => {

    const artists = useUploadStoreSelectors.artists();

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                padding: spacing.m,
                marginHorizontal: spacing.m,
                backgroundColor: palette.darkgrey
            },
            text: {
                color: palette.offwhite,
            }
        })
    }, []);

    if(_.sum(_.map(artists, artist => artist.royalties)) === 100) return <Fragment />

    return(
        <View style={styles.wrapper}>
            <Text style={styles.text}>
                Make sure the sum of the royalties is 100%
            </Text>
        </View>
    )
}

export default UploadRoyaltiesNotice