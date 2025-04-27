import {StyleSheet, View} from 'react-native'
import {useMemo} from "react";
import {palette} from "@/theme";
import AuthenticateHeader from "@/features/auth/components/AuthenticateHeader";
import AuthenticateContent from "@/features/auth/components/AuthenticateContent";

const Authenticate = () => {

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                flex: 1,
                backgroundColor: palette.black
            },
        })
    }, []);

    return(
        <View style={styles.wrapper}>
            <AuthenticateHeader title={"Login or create an account to share your talent"} />
            <AuthenticateContent />
        </View>
    )
}

export default Authenticate