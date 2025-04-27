import {StyleSheet, View} from 'react-native'
import {useMemo} from "react";
import UserTileImage from "@/features/user/components/user-tile/UserTileImage";
import UserTileName from "@/features/user/components/user-tile/UserTileName";
import User from "@/features/user/classes/User";
import SingleUser from "@/features/user/classes/SingleUser";

interface UserTileProps {
    selectable?: boolean
    selected?: boolean
    onSelect?: (user: User | SingleUser) => unknown
}

const UserTile = ({selectable, selected, onSelect}: UserTileProps) => {

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
        })
    }, []);

    return(
        <View style={styles.wrapper} >
            <UserTileImage size={150} selectable={selectable} onSelect={onSelect} selected={selected} />
            <UserTileName />
        </View>
    )
}

export default UserTile