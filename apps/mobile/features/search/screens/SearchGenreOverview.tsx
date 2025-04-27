import {StyleSheet, View} from 'react-native'
import {useMemo} from "react";

interface SearchGenreOverviewProps {

}

const SearchGenreOverview = ({}: SearchGenreOverviewProps) => {

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

export default SearchGenreOverview