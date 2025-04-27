import {TouchableOpacity, View} from 'react-native'
import {ViewStyle} from 'react-native/Libraries/StyleSheet/StyleSheetTypes'
import _ from "lodash";
import {useCallback, useMemo} from "react";
import Info from "@/assets/icons/Info";
import UserImageCircle from "@/features/user/components/UserImageCircle";
import {useAlertContext} from "@/features/alert/context/AlertContextProvider";
import {palette} from "@/theme";
import {UserInterface} from "@/features/user/types";
import {router} from "expo-router";

interface AlertRowUsersProps {

}

const AlertRowUsers = ({}: AlertRowUsersProps) => {

	const alert = useAlertContext()

    const styles: Record<string, ViewStyle> = {
		wrapper: {
			width: 50,
			justifyContent: 'center',
			flexDirection: 'row',
			gap: -8
		},
	    image : {

	    },
	    circle: {
			width: 50, height: 50,
		    borderRadius: 50,
		    backgroundColor: palette.grey,
		    justifyContent: 'center',
		    alignItems: 'center'
	    }
    }

	const routeUser = useCallback((user: UserInterface) => () => {
	    router.push(`/user/${user.id}`)
	}, [])

	const Content = useMemo(() => {
	    switch (alert.getAction()) {
		    case "Info": return (
				<View style={styles.circle}>
					<Info />
				</View>
		    )

		    default: return _.map(_.take(alert.getUsers(), 2), (user, index) => (
			    <TouchableOpacity style={{ marginLeft: index * 12 * -1 }} key={index} onPress={routeUser(user)}>
				    <UserImageCircle size={32} source={user.avatar_url} />
			    </TouchableOpacity>
		    ))
	    }
	}, [alert, styles.circle])

    return(
        <View style={styles.wrapper}>
	        { Content }
        </View>
    )
}

export default AlertRowUsers