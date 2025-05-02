import {Linking, StyleSheet, Text, useWindowDimensions, View} from 'react-native'
import {useCallback, useMemo} from "react";
import {palette, spacing} from "@/theme";
import Button from "@/common/components/Button";

interface ShareContentProps {
    id: number
    title: string
    image: string
    artist: string
}

const ShareContent = ({id, title, artist, image}: ShareContentProps) => {

    const { width, height } = useWindowDimensions();

    console.log(image)

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                gap: spacing.s,
                width: width || '100vw',
                height: height || '100vh',
                alignItems: 'center',
                justifyContent: 'center',
            },
            image: {
                width: 200,
                height: 200
            },
            title: {
                fontSize: 24,
                textAlign: 'center',
                color: palette.offwhite
            },
        })
    }, []);

    const handleRouteApp = useCallback(async () => {
        await Linking.openURL(`doomdoomtech://track/${id}`)
    }, [])

    return(
        <View style={styles.wrapper}>
            <img src={image} style={styles.image} alt={''}/>
            <Text style={styles.title}>
                { artist } - { title }
            </Text>
            <Button fill={'olive'} label={"View in app"} callback={handleRouteApp} />
        </View>
    )
}

export default ShareContent
