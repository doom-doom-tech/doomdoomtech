import {StyleSheet, TouchableOpacity, View} from 'react-native'
import {Fragment, useCallback, useMemo} from "react";
import {Image} from "expo-image";
import useUserContext from "@/features/user/hooks/useUserContext";
import User from "@/assets/icons/User";
import UserClass from "@/features/user/classes/User"
import {palette} from "@/theme";
import {router} from "expo-router";
import _ from 'lodash';
import SingleUser from "@/features/user/classes/SingleUser";
import Check from "@/assets/icons/Check";

interface UserTileImageProps {
    size: number
    selectable?: boolean
    selected?: boolean
    onSelect?: (user: UserClass | SingleUser) => unknown
}

const UserTileImage = ({size, selectable, selected, onSelect = _.noop}: UserTileImageProps) => {

    const user = useUserContext()

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
                alignItems: 'center',
                backgroundColor: selected ? palette.olive : palette.lightgrey
            }
        })
    }, [size, selected]);

    const handleRouteUser = useCallback(() => {
        router.push(`/user/${user.getID()}`)
    }, [user])

    const handleSelectUser = useCallback(() => {
        onSelect(user)
    }, [user, onSelect])

    const SelectionComponent = useCallback(() => {
        if(!selectable) return <Fragment />
        return(
            <View style={styles.selectionCircle}>
                { selected && <Check color={palette.black}/> }
            </View>
        )
    }, [selected])

    if(!user.getImageSource()) {
        return (
            <TouchableOpacity style={styles.wrapper} onPress={handleRouteUser}>
                <User />
            </TouchableOpacity>
        )
    }

    return(
        <TouchableOpacity style={styles.wrapper}  onPress={selectable ? handleSelectUser : handleRouteUser}>
            <Image source={user.getImageSource()} style={styles.image} />
            <SelectionComponent />
        </TouchableOpacity>
    )
}

export default UserTileImage