import {StyleSheet, useWindowDimensions, View} from 'react-native'
import {useMemo} from "react";
import Text from '@/common/components/Text';
import {palette, spacing} from '@/theme';
import HeartFilled from '@/assets/icons/HeartFilled';
import {useSearchStoreSelectors} from '@/features/search/store/search';


const TopPicksEmpty = () => {

    const { width } = useWindowDimensions()

    const query = useSearchStoreSelectors.query();
    const setSearchState = useSearchStoreSelectors.setState();
    
    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                flex: 1,
                alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                gap: spacing.m,
                width: width - spacing.m * 2
            },
            title: {
                fontSize: 24,
                fontWeight: 'bold',
                color: palette.offwhite
            },
            subtitle: {
                fontSize: 16,
                textAlign: 'center',
                color: palette.granite
            }
        })
    }, []);

    if(query) return(
        <View style={styles.wrapper}>
            <Text style={styles.title}>No tracks found</Text>
            <Text style={styles.subtitle}>Try a different search</Text>
        </View>
    )

    return(
        <View style={styles.wrapper}>
            <Text style={styles.title}>Your favorites live here.</Text>
            <HeartFilled color={palette.olive} />
            <Text style={styles.subtitle}>Hit the heart on tracks you like. You can reorder them to build your personal Top Picks.</Text>
        </View>
    )
}

export default TopPicksEmpty