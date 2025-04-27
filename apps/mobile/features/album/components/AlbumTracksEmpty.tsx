import { View, StyleSheet } from 'react-native'
import {useMemo} from "react";
import { ViewStyle } from 'react-native/Libraries/StyleSheet/StyleSheetTypes'
import Text from "@/common/components/Text";
import {palette} from "@/theme";

interface AlbumTracksEmptyProps {

}

const AlbumTracksEmpty = ({}: AlbumTracksEmptyProps) => {

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
            text: {
                textAlign: 'center',
                color: palette.granite
            }
        })
    }, []);

    return(
        <View style={styles.wrapper}>
            <Text style={styles.text}>
                Start by selecting some tracks first
            </Text>
        </View>
    )
}

export default AlbumTracksEmpty