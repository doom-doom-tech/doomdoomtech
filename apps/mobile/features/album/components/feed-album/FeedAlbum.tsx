import {StyleSheet, View} from 'react-native'
import {useMemo} from "react";

interface FeedAlbumProps {

}

const FeedAlbum = ({}: FeedAlbumProps) => {

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

export default FeedAlbum