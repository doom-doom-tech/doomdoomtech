import {StyleSheet, Text, View} from 'react-native'
import {useMemo} from "react";
import Logo from "@/assets/icons/Logo";
import {palette} from "@/theme";
import Header from "@/common/components/header/Header";

interface AuthenticateHeaderProps {
    title: string
}

const AuthenticateHeader = ({title}: AuthenticateHeaderProps) => {

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
            title: {
                color: palette.offwhite
            },
            content: {
                alignItems: 'center'
            }
        })
    }, []);

    return(
        <View style={styles.wrapper}>
            <Header title={"Login/Register"} />
            <View style={styles.content}>
                <Logo width={150} height={50} />
                <Text style={styles.title}>{title}</Text>
            </View>
        </View>
    )
}

export default AuthenticateHeader