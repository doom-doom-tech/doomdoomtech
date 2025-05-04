import {StyleSheet, TouchableOpacity, View} from 'react-native'
import Text from "@/common/components/Text";
import FilterIcon from "@/features/filter/components/FilterIcon";
import {router} from "expo-router";
import {palette, spacing} from "@/theme";

interface ChartsHeaderProps {

}

const ChartsHeader = ({}: ChartsHeaderProps) => {

    const styles = StyleSheet.create({
        wrapper: {
            height: 60,
            flexDirection: 'row',
        },
        searchbar: {
            flex: 5,
            height: 60,
            justifyContent: 'center',
            marginHorizontal: spacing.m,
            backgroundColor: palette.black,
            borderRadius: 4,
            borderWidth: 1,
            borderColor: palette.granite,
            padding: spacing.m
        },
        placeholder: {
            color: palette.granite
        },
        filter: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        },
    })

    const handleRouteSearch = () => {
        router.push('/search')
    }

    return(
        <View style={styles.wrapper}>
            <TouchableOpacity onPress={handleRouteSearch} style={styles.searchbar}>
                <Text style={styles.placeholder}>
                    Search for new music or talents
                </Text>
            </TouchableOpacity>
            <View style={styles.filter}>
                <FilterIcon available={['genre', 'label', 'period', 'subgenre']} />
            </View>
        </View>
    )
}

export default ChartsHeader