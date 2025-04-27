import {StyleSheet, useWindowDimensions, View} from 'react-native'
import {Fragment, useMemo} from "react";
import {BlurView} from "expo-blur";
import {useShareStoreSelectors} from "@/features/share/store/share";
import {Image} from "expo-image";

interface ShareBackgroundProps {

}

const ShareBackground = ({}: ShareBackgroundProps) => {

    const { width: size } = useWindowDimensions()

    const entity = useShareStoreSelectors.entity()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                opacity: 0.5,
                width: size, height: 800,
                ...StyleSheet.absoluteFillObject,
            },
            blurview: {
                position: 'absolute',
                width: size, height: 800,
            },
            image: {
                width: size, height: 800,
            }
        })
    }, []);

    if(!entity) return <Fragment />

    return(
        <View style={styles.wrapper}>
            <Image source={entity.getCoverSource()} style={styles.image} />
            <BlurView tint={'dark'} intensity={100} style={styles.blurview} />
        </View>
    )
}

export default ShareBackground