import {StyleSheet, useWindowDimensions, View} from 'react-native'
import React, {useMemo} from "react";
import Text from "@/common/components/Text";
import {palette, spacing} from "@/theme";
import useGlobalUserContext from "@/features/user/hooks/useGlobalUserContext";
import CheckCircle from "@/assets/icons/CheckCircle";

interface UploadBoostsInformationProps {

}

const UploadBoostsInfo = ({}: UploadBoostsInformationProps) => {

    const { width, height } = useWindowDimensions()

    const user = useGlobalUserContext()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                paddingHorizontal: spacing.m
            },

            title: {
                fontSize: 24,
                color: palette.offwhite
            },
            price: {
                fontSize: 32,
                fontWeight: 'bold',
                color: palette.olive
            },
            main: {
                color: palette.granite
            },
            bullet: {
                color: palette.granite
            },
            usps: {
                gap: 8,
                marginVertical: 24,
            },
            usp: {
                flexDirection: 'row',
                alignItems: 'center',
                gap: spacing.m,
                maxWidth: width - 100
            },
            text: {
                color: palette.granite,
                fontSize: 16,
                lineHeight: 20
            },
        })
    }, []);

    const usps = [
        {
            label: "Streamline submissions with a professional demo inbox, making it easy to manage and review incoming tracks from artists.",
            user: "Get professional mastering tools to enhance your tracks' dynamic range."
        },
        {
            label: "Enable a label tag for artists, allowing them to send tracks directly to your label during their upload process—no more missed demos.",
            user: "Earn double credits for all your platform engagement"
        },
        {
            label: "Track demo performance at a glance, so you can focus only on the most promising, high-performing submissions.",
            user: "See detailed insights about who visited your profile"
        },
        {
            label: "See who’s viewing your label profile, giving you valuable insights into the artists and fans engaging with your brand.",
            user: "Increase your music's visibility and chances of appearing in playlists and recommendations."
        },
        {
            label: "",
            user: "Use up to 5 label tags per upload and spotlight your tracks to your favorite labels and A&R managers."
        },
    ]

    return(
        <View style={styles.wrapper}>

            <Text style={styles.title}>
                Doomdoomtech premium
            </Text>
            <Text style={styles.main}>
                Elevate your music with professional tools and insights designed to boost your success
            </Text>

            <View style={styles.usps}>
                { usps
                    .filter(usp => usp[user!.isLabel() ? 'label' : 'user'] !== "")
                    .map((usp, index) => (
                        <View style={styles.usp}>
                            <CheckCircle color={palette.olive} />
                            <Text style={styles.text}>
                                {usp[user!.isLabel() ? 'label' : 'user']}
                            </Text>
                        </View>
                    ))}
            </View>
        </View>
    )
}

export default UploadBoostsInfo