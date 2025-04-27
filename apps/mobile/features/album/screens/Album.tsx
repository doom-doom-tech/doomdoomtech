import { View, StyleSheet } from 'react-native'
import {useMemo} from "react";
import { ViewStyle } from 'react-native/Libraries/StyleSheet/StyleSheetTypes'

interface AlbumProps {

}

const Album = ({}: AlbumProps) => {

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
        })
    }, []);

    return(
        <View style={styles.wrapper}>

        </View>
    )
}

export default Album