import FilterIcon from '@/features/filter/components/FilterIcon'
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import { palette, spacing } from '@/theme'
import Input from '@/common/components/inputs/Input'
import SearchBar from '@/common/components/SearchBar'

const TopPicksSearchbar = () => {

    const styles = StyleSheet.create({
        wrapper: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: spacing.m,
            marginBottom: spacing.s
        },
        searchbar: {
            flex: 5,
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

    return (
        <View style={styles.wrapper}>
            <View style={styles.searchbar}>
                <SearchBar placeholder='Search for tracks in your favorites' />   
            </View>
            <View style={styles.filter}>
                <FilterIcon available={['genre', 'subgenre']} />
            </View>
        </View>
    )
}

export default TopPicksSearchbar