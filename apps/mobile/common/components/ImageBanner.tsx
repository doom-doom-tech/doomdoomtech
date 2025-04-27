import {StyleSheet, View} from 'react-native'
import {useMemo} from "react";
import {ImageBackground} from "expo-image";
import {palette, spacing} from "@/theme";
import Text from "@/common/components/Text";

interface ImageBannerProps {
    size: number
    source: string
    action: string
    title: string
    subtitle: string
    callback: (...args: Array<any>) => unknown
}

const ImageBanner = ({size, source, action, title, subtitle, callback}: ImageBannerProps) => {

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                position: 'relative',
                width: size,
                height: size
            },
            image: {
                width: size,
                height: size,
                opacity: 0.5,
                position: 'absolute'
            },
            content: {
                gap: spacing.s,
                width: size,
                height: size * 1.5,
                alignItems: 'center',
                justifyContent: 'center'
            },
            title: {
                fontSize: 24,
                fontWeight: '700',
                color: palette.offwhite,
            },
            subtitle: {
                color: palette.offwhite,
                textAlign: 'center',
                fontSize: 18,
                fontWeight: '300',
                paddingHorizontal: spacing.m
            }
        })
    }, []);

    return(
        <View style={styles.wrapper}>
            <ImageBackground style={styles.image} source={source} />
            <View style={styles.content}>
                <Text style={styles.title}>
                    {title}
                </Text>
                <Text style={styles.subtitle}>
                    {subtitle}
                </Text>
            </View>
        </View>
    )
}

export default ImageBanner