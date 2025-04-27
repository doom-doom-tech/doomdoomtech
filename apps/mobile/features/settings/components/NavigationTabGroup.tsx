import {StyleSheet, View} from 'react-native'
import {WithChildren} from "@/common/types/common";
import Text from "@/common/components/Text";
import {palette, spacing} from "@/theme";

interface NavigationTabGroupProps extends WithChildren {
	title: string
}

const NavigationTabGroup = ({title, children}: NavigationTabGroupProps) => {

    const styles = StyleSheet.create({
	    wrapper: {
		    display: 'flex',
		    flexDirection: 'column',
	    },
	    title: {
		    color: palette.offwhite,
		    paddingLeft: spacing.s,
		    marginBottom: spacing.s,
		    opacity: 0.35,
		    fontSize: 18
	    }
    })

    return(
        <View style={styles.wrapper}>
	        <Text style={styles.title}>
		        {title}
	        </Text>
	        {children}
        </View>
    )
}

export default NavigationTabGroup