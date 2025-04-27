import {StyleSheet, View} from 'react-native'
import {useMemo} from "react";
import Text from "@/common/components/Text";
import {palette, spacing} from "@/theme";
import _ from "lodash";
import useGlobalUserContext from "@/features/user/hooks/useGlobalUserContext";

interface UploadBoostsInformationProps {

}

const UploadBoostsInfo = ({}: UploadBoostsInformationProps) => {

    const user = useGlobalUserContext()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                gap: spacing.m,
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
            }
        })
    }, []);

    const usps = [
        {
            label: "Streamline submissions with a professional demo inbox, making it easy to manage and review incoming tracks from artists.",
            user: "Get professional mastering tools to enhance your tracks' dynamic range and perceived loudness, giving your music that polished, commercial-ready sound."
        },
        {
            label: "Enable a label tag for artists, allowing them to send tracks directly to your label during their upload process—no more missed demos.",
            user: "Earn double credits for all your platform engagement, allowing you to grow your presence faster and reach more listeners."
        },
        {
            label: "Track demo performance at a glance, so you can focus only on the most promising, high-performing submissions.",
            user: "See detailed insights about who visited your profile, helping you understand and connect with your audience more effectively."
        },
        {
            label: "See who’s viewing your label profile, giving you valuable insights into the artists and fans engaging with your brand.",
            user: "Increase your music's visibility and chances of appearing in playlists and recommendations."
        },
    ]

    return(
        <View style={styles.wrapper}>
            <Text style={styles.title}>
                Doomdoomtech premium
            </Text>
            <Text style={styles.price}>
                €10/month
            </Text>
            <Text style={styles.main}>
                Elevate your music with professional tools and insights designed to boost your success
            </Text>

            { _.map(usps, (usp, __) => (
                <Text style={styles.bullet}>
                    - {usp[user!.isLabel() ? 'label' : 'user']}
                </Text>
            ))}
        </View>
    )
}

export default UploadBoostsInfo