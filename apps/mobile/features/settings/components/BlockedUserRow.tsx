import {Pressable, StyleSheet, View} from 'react-native'
import {Image, ImageStyle} from "expo-image";
import Text from "@/common/components/Text";
import {palette, spacing} from "@/theme";
import Button from "@/common/components/buttons/Button";
import {useCallback} from "react";
import {formatServerErrorResponse} from "@/common/services/utilities";
import useUserContext from "@/features/user/hooks/useUserContext";
import useUserUnblock from "@/features/user/hooks/useUserUnblock";
import Toast from "react-native-root-toast";
import {TOASTCONFIG} from "@/common/constants";

const BlockedUserRow = () => {

	const user = useUserContext()

	const styles = StyleSheet.create({
		wrapper: {
			width: '100%',
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			paddingHorizontal: spacing.m,
			borderBottomWidth: 1,
			borderColor: palette.granite,
			paddingVertical: spacing.s,
		},
		content: {
			display: 'flex',
			gap: spacing.s,
			flexDirection: 'row',
			alignItems: 'center'
		},
		avatar: {
			width: 50,
			height: 50,
			borderRadius: 32
		},
		username: {
			fontSize: 18,
			color: palette.offwhite
		}
	})

	const unblockMutation = useUserUnblock()

	const handleUnblock = useCallback(async () => {
		try {
			await unblockMutation.mutateAsync({
				blockedID: user.getID()
			})

			Toast.show('User unblocked', TOASTCONFIG.success)
		} catch(e: any) {
			Toast.show(formatServerErrorResponse(e), TOASTCONFIG.error)
		}
	}, [unblockMutation, user])

    return(
        <View style={styles.wrapper}>
            <View style={styles.content}>
	            <Image source={user.getImageSource()} style={styles.avatar as ImageStyle} />
	            <Text style={styles.username}>
		            {user.getUsername()}
	            </Text>
            </View>

	        <Pressable>
		        <Button label={"Unblock"} loading={false} callback={handleUnblock} />
	        </Pressable>
        </View>
    )
}

export default BlockedUserRow