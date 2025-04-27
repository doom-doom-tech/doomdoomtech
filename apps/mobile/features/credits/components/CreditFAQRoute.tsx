import {StyleSheet, TouchableOpacity} from 'react-native'
import {useCallback, useMemo} from "react";
import Text from "@/common/components/Text";
import {palette} from "@/theme";
import {router} from "expo-router";

interface CreditFAQRouteProps {

}

const CreditFAQRoute = ({}: CreditFAQRouteProps) => {

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
            link: {
                textAlign: 'center',
                color: palette.offwhite,
                textDecorationLine: 'underline'
            }
        })
    }, []);

    const handleRoute = useCallback(() => {
        router.push('/credits/faq')
    }, [])

    return(
        <TouchableOpacity style={styles.wrapper} onPress={handleRoute}>
            <Text style={styles.link}>
                How do i earn credits?
            </Text>
        </TouchableOpacity>
    )
}

export default CreditFAQRoute