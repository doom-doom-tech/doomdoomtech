import {StyleSheet, View} from 'react-native'
import {useMemo} from "react";
import Header from "@/common/components/header/Header";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import Text from "@/common/components/Text";
import {palette} from "@/theme";
import MandatoryRatingTracks from "@/features/track/components/mandatory-rating/MandatoryRatingTracks";

interface MandatoryRatingProps {

}

const MandatoryRating = ({}: MandatoryRatingProps) => {

    const {top} = useSafeAreaInsets()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                paddingTop: top
            },
            subtitle: {
                color: palette.granite,
                fontSize: 18,
                textAlign: 'center',
                fontWeight: '200'
            }
        })
    }, []);

    return (
        <View style={styles.wrapper}>
            <Header title={"Rate a track"} hideBackButton/>
            <Text style={styles.subtitle}>
                Your feedback is valuable!
                Help artists reach the charts by rating at least one of the last three tracks you listened to
            </Text>
            <MandatoryRatingTracks />
        </View>
    )
}

export default MandatoryRating