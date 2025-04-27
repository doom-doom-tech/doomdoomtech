import {StyleSheet, View} from 'react-native'
import Text from "@/common/components/Text";
import {palette, spacing} from "@/theme";
import Button from "@/common/components/buttons/Button";
import {router} from "expo-router";
import {useCallback} from "react";

interface DeleteAccountProps {

}

const DeleteAccount = ({}: DeleteAccountProps) => {

    const styles = StyleSheet.create({
	    wrapper: {
		    flex: 1,
		    paddingTop: 50,
		    paddingHorizontal: spacing.m
	    },
	    content: {
		    textAlign: 'center',
		    color: palette.error,
		    fontSize: 18
	    },
	    actions: {
		    display: 'flex',
		    flexDirection: 'column',
		    gap: spacing.m
	    }
    })

	const handleDeleteAccount = useCallback(async () => {

	}, [])

    return(
        <View style={styles.wrapper}>
            <Text style={styles.content}>
	            {
					"Upon confirming account deletion, you will immediately lose access to your account and all personal data will be permanently removed. This action is irreversible, your data cannot be recovered. \n\n" +
		            "Any active subscriptions will be cancelled. Please ensure you've saved all necessary data before proceeding. Confirm to delete, or Cancel to keep your account.\n"
				}
            </Text>
			<View style={styles.actions}>
				<Button label={"Cancel"} fill={'granite'} loading={false} callback={router.back} />
				<Button label={"Delete my account"} loading={false} callback={router.back} />
			</View>
        </View>
    )
}

export default DeleteAccount