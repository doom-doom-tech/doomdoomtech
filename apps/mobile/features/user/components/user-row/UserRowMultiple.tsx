import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {useCallback, useMemo} from "react";
import UserCircle from "@/features/user/components/UserCircle";
import {palette, spacing, styling} from "@/theme";
import User from "@/features/user/classes/User";
import _ from 'lodash';
import {useArtistsStoreSelectors} from "@/features/track/store/artists";
import {router} from "expo-router";
import LabelBadge from "@/common/components/LabelBadge";

interface UserRowProps {
    users: Array<User>
}

const UserRowMultiple = ({users}: UserRowProps) => {

    // Early-return if the array is empty or undefined:
    if (!users || users.length === 0) {
        return null;
    }

    const setArtistsState = useArtistsStoreSelectors.setState()

    const styles = StyleSheet.create({
        wrapper: {
            flexDirection: 'row',
            paddingLeft: spacing.m,
            justifyContent: 'space-between'
        },
        username: {
            color: palette.offwhite,
            fontWeight: '700',
        },
        images: {
            flexDirection: 'row',
            position: 'relative',
            width: 50,
            height: 50,
            borderRadius: 50,
            overflow: 'hidden',
        },
        overlay: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: palette.black + '80',
        },
        image: {
            marginLeft: spacing.m * -1
        },
        label: {
            color: palette.offwhite,
            fontWeight: 'bold',
            fontSize: 18
        }
    })

    const triggerMultipleUsersSheet = useCallback(() => {
        setArtistsState({ artists: users })
        router.push('/artists')
    }, [users]);

    const UserNames = useMemo(() => {
        if (users[0] && users[0].isLabel()) {
            return (
                <View style={styling.row.xs}>
                    <Text style={styles.username}>
                        { users[0].getUsername() }
                    </Text>
                    <LabelBadge size={16} />
                    <Text style={styles.username}>and others...</Text>
                </View>
            );
        } else {
            return (
                <Text style={styles.username}>
                    { users[0].getUsername() } and others...
                </Text>
            );
        }
    }, [users]);

    return (
        <View style={styles.wrapper}>
            <TouchableOpacity
                style={styling.row.m}
                activeOpacity={0.5}
                onPress={triggerMultipleUsersSheet}
            >
                <View style={styles.images}>
                    <UserCircle source={_.first(users)!.getImageSource()} size={50} />
                    <View style={styles.overlay}>
                        <Text style={styles.label}>
                            +{users.length - 1}
                        </Text>
                    </View>
                </View>
                {UserNames}
            </TouchableOpacity>
        </View>
    );
};

export default UserRowMultiple;