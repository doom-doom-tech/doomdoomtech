import {StyleSheet, View} from 'react-native'
import {Image, ImageStyle} from "expo-image";
import User from "@/assets/icons/User";
import {palette} from "@/theme";

interface UserImageCircleProps {
	size: number
	source: string | null
}

const UserImageCircle = ({size, source}: UserImageCircleProps) => {

	const styles = StyleSheet.create({
		wrapper : {
			width: size,
			height: size,

			alignItems: 'center',
			justifyContent: 'center',

		},
	    image : {
			width: size,
		    height: size,
		    overflow: 'hidden',
		    objectFit: 'cover',
		    borderRadius: size,
		    backgroundColor: palette.granite
	    } as ImageStyle
    })

	if(!source) {
		return (
			<View style={styles.wrapper}>
				<User width={size / 2} height={size / 2} />
			</View>
		)
	}

    return(
        <View style={styles.wrapper}>
            <Image source={source} style={styles.image as ImageStyle} />
        </View>
    )
}

export default UserImageCircle