import {StyleSheet, TouchableOpacity} from 'react-native'
import {ReactElement} from "react";
import {palette} from "@/theme";

interface SocialLoginButtonProps {
	Icon: ReactElement,
	callback: (...args: any[]) => unknown
}

const SocialLoginButton = ({Icon, callback}: SocialLoginButtonProps) => {

    const styles = StyleSheet.create({
		wrapper: {
			width: 70,
			height: 70,
			borderWidth: 3,
			justifyContent: 'center',
			alignItems: 'center',
			borderColor: palette.offwhite,
			borderRadius: 70,
		}
    })

    return(
        <TouchableOpacity style={styles.wrapper} onPress={callback}>
	        { Icon }
        </TouchableOpacity>
    )
}

export default SocialLoginButton