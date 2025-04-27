import {ActivityIndicator, StyleSheet, View} from 'react-native'
import {useMemo} from "react";

interface SingleTrackLoadingProps {

}

const SingleTrackLoading = ({}: SingleTrackLoadingProps) => {

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            },
        })
    }, []);

    return(
        <View style={styles.wrapper}>
            <ActivityIndicator />
        </View>
    )
}

export default SingleTrackLoading