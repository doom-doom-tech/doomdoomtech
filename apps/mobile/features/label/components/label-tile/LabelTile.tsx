import {StyleSheet, View} from 'react-native'
import {useMemo} from "react";
import LabelTileImage from "@/features/label/components/label-tile/LabelTileImage";
import LabelTileName from "@/features/label/components/label-tile/LabelTileName";

interface LabelTileProps {

}

const LabelTile = ({}: LabelTileProps) => {

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
        })
    }, []);

    return(
        <View style={styles.wrapper}>
            <LabelTileImage size={150} />
            <LabelTileName />
        </View>
    )
}

export default LabelTile