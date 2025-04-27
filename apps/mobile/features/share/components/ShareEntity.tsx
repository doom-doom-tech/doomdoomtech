import {StyleSheet, useWindowDimensions, View} from 'react-native'
import {useMemo} from "react";
import {useShareStoreSelectors} from "@/features/share/store/share";
import {Image} from "expo-image";
import Text from "@/common/components/Text";
import {palette} from "@/theme";

interface ShareEntityProps {

}

const ShareEntity = ({}: ShareEntityProps) => {

    const { width: size } = useWindowDimensions()

    const entity = useShareStoreSelectors.entity()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                justifyContent: 'center',
                alignItems: 'center'
            },
            image: {
                width: 250,
                height: 250,
            },
            title: {
                width: 250,
                fontSize: 24,
                textAlign: 'center',
                color: palette.offwhite
            }
        })
    }, []);

    return(
        <View style={styles.wrapper}>
            <Image style={styles.image} source={entity?.getCoverSource()} />
            <Text style={styles.title}>
                { entity?.getTitle() }
            </Text>
        </View>
    )
}

export default ShareEntity