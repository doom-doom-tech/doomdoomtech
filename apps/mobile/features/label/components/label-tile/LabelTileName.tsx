import {StyleSheet, View} from 'react-native'
import {useMemo} from "react";
import Text from "@/common/components/Text";
import {useLabelContext} from "@/features/label/context/LabelContextProvider";
import {palette} from "@/theme";

interface LabelTileNameProps {

}

const LabelTileName = ({}: LabelTileNameProps) => {

    const label = useLabelContext()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
            name: {
                fontSize: 18,
                color: palette.offwhite,
                textAlign: 'center'
            }
        })
    }, []);

    return(
        <View style={styles.wrapper}>
            <Text style={styles.name}>
                {label.getUsername()}
            </Text>
        </View>
    )
}

export default LabelTileName