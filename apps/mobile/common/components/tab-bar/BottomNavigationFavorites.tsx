import {StyleSheet, View} from 'react-native'
import {useMemo, useState} from "react";
import Heart from "@/assets/icons/Heart";
import {palette} from "@/theme";
import Text from "@/common/components/Text";
import useListCount from "@/features/list/hooks/useListCount";
import millify from 'millify';
import useEventListener from '@/common/hooks/useEventListener';

interface BottomNavigationFavoritesProps {

}

const BottomNavigationFavorites = ({}: BottomNavigationFavoritesProps) => {

    const listCountQuery = useListCount()

    const [count, setCount] = useState<number>(listCountQuery.data || 0)

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                position: 'relative'
            },
            notify: {
                minWidth: 12,
                position: 'absolute',
                bottom: -4,
                alignSelf: 'center',
                paddingHorizontal: 2,
                backgroundColor: palette.error,
                borderRadius: 2,
                justifyContent: 'center',
                alignItems: 'center'
            },
            count: {
                fontSize: 12,
                color: palette.offwhite
            }
        })
    }, []);

    const shouldNotify = useMemo(() => {
        return count > 0
    }, [listCountQuery])

    useEventListener('list:count:reset', () => setCount(0))
    useEventListener('list:track:save', () => setCount(previous => previous + 1))
    useEventListener('list:track:remove', () => setCount(previous => {
        return previous > 0 ? previous - 1 : 0
    }))

    return(
        <View style={styles.wrapper}>
            <Heart />

            { shouldNotify && (
                <View style={styles.notify}>
                    <Text style={styles.count}>
                        {millify(count)}
                    </Text>
                </View>
            )}
        </View>
    )
}

export default BottomNavigationFavorites