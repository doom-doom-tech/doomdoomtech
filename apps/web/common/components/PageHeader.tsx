import {Pressable, StyleSheet, View} from 'react-native'
import {ReactElement, useCallback} from "react";
import Text from "@/common/components/Text";
import {spacing} from "@/theme";
import ChevronLeft from "@/assets/icons/ChevronLeft";
import {useRouter} from "expo-router";

interface PageHeaderProps {
	title: string
	previous?: string
	Config: ReactElement | Array<ReactElement>
}

const PageHeader = ({title, previous, Config}: PageHeaderProps) => {

	const router = useRouter()

    const styles = StyleSheet.create({
		wrapper: {
			justifyContent: 'space-between',
			flexDirection: 'row',
			alignItems: 'center',
			paddingHorizontal: spacing.s
		},
	    left : {
			flexDirection: 'row',
		    alignItems: 'center',
		    gap: spacing.m
	    },
	    text: {
			fontSize: 24,
		    fontWeight: '700',
		    maxWidth: '100%'
	    },
	    config : {
			flexDirection: 'row',
		    gap: spacing.s
	    }
    })

	const handleBackNavigation = useCallback(() => {
	    router.push(previous)
	}, [previous])

    return(
        <View style={styles.wrapper}>
	        <View style={styles.left}>
		        { previous && <Pressable onPress={handleBackNavigation}><ChevronLeft /></Pressable> }
		        <Text style={styles.text}>{ title }</Text>
	        </View>
	        <View style={styles.config}>
		        { Config }
	        </View>
        </View>
    )
}

export default PageHeader