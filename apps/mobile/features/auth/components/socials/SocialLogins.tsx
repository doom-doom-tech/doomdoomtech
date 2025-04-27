import {Platform, StyleSheet, View} from 'react-native'
import {palette, spacing} from "@/theme";
import GoogleLogin from "@/features/auth/components/socials/GoogleLogin";
import AppleLogin from "@/features/auth/components/socials/AppleLogin";

const SocialLogins = () => {

    const styles = StyleSheet.create({
        wrapper: {
            justifyContent: 'center',
            alignItems: 'center',
        },
        line: {
            width: 50,
            height: 1,
            alignSelf: 'center',
            marginVertical: 40,
            backgroundColor: palette.offwhite
        },
        logins: {
            flexDirection: 'row',
            gap: spacing.m
        }
    })

    return(
        <View style={styles.wrapper}>
            <View style={styles.line} />
            <View style={styles.logins}>
                <GoogleLogin />
                { Platform.OS === 'ios' && <AppleLogin /> }
            </View>
        </View>
    )
}

export default SocialLogins