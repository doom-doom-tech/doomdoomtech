import {StyleSheet, useWindowDimensions, View} from 'react-native'
import {useMemo} from "react";
import {palette, spacing} from "@/theme";
import {ImageBackground} from "expo-image";
import ErrorBackground from "@/assets/images/error-background.png"
import Text from "@/common/components/Text";
import Button from "@/common/components/buttons/Button";
import {router} from "expo-router";

interface ErrorProps {
    title: string
}

const Error = ({title}: ErrorProps) => {

    const { width } = useWindowDimensions()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                flex: 1,
                gap: spacing.s,
                position: 'relative',
                backgroundColor: palette.purple,
                paddingTop: 400
            },
            background: {
                position: 'absolute',
                width: width, height: 800
            },
            title: {
                alignSelf: 'center',
                textAlign: 'center',
                fontSize: 24,
                color: palette.offwhite,
                fontWeight: 'bold'
            }
        })
    }, []);

    return(
        <View style={styles.wrapper}>
            <ImageBackground source={ErrorBackground} style={styles.background} />
            <Text style={styles.title}>
                {title}
            </Text>
            <Button label={"Go back"} callback={router.back} />
        </View>
    )
}

export default Error