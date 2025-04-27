import {StyleSheet, TouchableOpacity, View} from 'react-native'
import {useCallback, useMemo} from "react";
import {useLabelContext} from "@/features/label/context/LabelContextProvider";
import {palette} from "@/theme";
import {router} from "expo-router";
import UserIcon from "@/assets/icons/User";
import User from "@/features/user/classes/User"
import Hashtag from "@/assets/icons/Hashtag";
import UserContextProvider from "@/features/user/context/UserContextProvider";
import UserImageCircle from "@/features/user/components/UserImageCircle";

interface LabelTileImageProps {
    size?: number
}

const LabelTileImage = ({size = 110}: LabelTileImageProps) => {

    const label = useLabelContext()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                position: 'relative',
                width: size, height: size,
                borderRadius: size,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: palette.darkgrey
            },
            image: {
                width: size, height: size,
                borderRadius: size,
            },
            selectionCircle: {
                width: 32,
                height: 32,
                borderRadius: 32,
                position: 'absolute',
                bottom: 0,
                right: 0,
                justifyContent: 'center',
                backgroundColor: palette.olive,
                alignItems: 'center'
            }
        })
    }, [size]);

    const handleRouteLabel = useCallback(() => {
        router.push(`/user/${label.getID()}`)
    }, [label])

    if(!label.getImageSource()) {
        return (
            <TouchableOpacity style={styles.wrapper} onPress={handleRouteLabel}>
                <UserIcon />
            </TouchableOpacity>
        )
    }

    return(
        <TouchableOpacity style={styles.wrapper}  onPress={handleRouteLabel}>
            <UserContextProvider user={label as unknown as User}>
                <UserImageCircle size={size} source={label.getImageSource()} />
                <View style={styles.selectionCircle}>
                    <Hashtag color={palette.offwhite}/>
                </View>
            </UserContextProvider>
        </TouchableOpacity>
    )
}

export default LabelTileImage