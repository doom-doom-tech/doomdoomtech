import {StyleSheet, View} from 'react-native'
import {useCallback, useMemo} from "react";
import Header from "@/common/components/header/Header";
import Text from "@/common/components/Text";
import {palette, spacing} from "@/theme";

interface UploadBoostsHeaderProps {

}

const UploadBoostsHeader = ({}: UploadBoostsHeaderProps) => {

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                gap: spacing.s,
                flexDirection: 'row',
                alignItems: 'center'
            },
            title: {
                fontSize: 18,
                fontWeight: 'bold',
                color: palette.offwhite
            },
            badge: {
                transform: [{ scale: 0.8 }]
            }
        })
    }, []);

    const TitleComponent = useCallback(() => (
        <View style={styles.wrapper}>
            <Text style={styles.title}>Boost your track</Text>
            {/*<Premium style={styles.badge} />*/}
        </View>
    ), [])

    return(
        <Header TitleComponent={TitleComponent} title={""} />
    )
}

export default UploadBoostsHeader