import {DeviceEventEmitter, Pressable, StyleSheet, useWindowDimensions, View} from 'react-native'
import {useCallback, useMemo} from "react";
import {constants, palette} from "@/theme";
import Icon from "@/common/components/icon/Icon";
import IconButton from "@/common/components/buttons/IconButton";
import UserCircle from "@/features/user/components/UserCircle";
import useGlobalUserContext from "@/features/user/hooks/useGlobalUserContext";
import {router, usePathname} from "expo-router";
import {useTabContext} from "@/common/context/TabBarContextProvider";
import _ from 'lodash';
import Plus from "@/assets/icons/Plus";
import Heart from "@/assets/icons/Heart";
import Search from '@/assets/icons/Search';

interface BottomNavigationProps {

}

const BottomNavigation = ({}: BottomNavigationProps) => {

    const user = useGlobalUserContext()

    const { state, navigation } = useTabContext()

    const { width } = useWindowDimensions()

    const currentlyFocusedIndex = useMemo(() => {
        // we skip 'Upload' because it's not actually a route
        switch (state.index) {
            case 0: // Feed route
                return 0
            case 1: // List route
                return 3
            case 2: // User route
                return 4
            case 3: // Search route
                return 1
            default:
                return 0
        }
    }, [state])

    const mappedRoutes = useMemo(() => ({
        'Feed' : state.routes[0],
        'List' : state.routes[1],
        'User' : state.routes[2],
        'Search' : state.routes[3],
    }), [state])

    const items = [
        {
            icon: <Icon name={'home'} pack={'material'} color={'offwhite'} />,
            label: 'Feed',
            active: false
        },
        {
            icon: <Search />,
            label: 'Search',
            active: false
        },
        {
            icon: <IconButton fill={'rose'} callback={() => DeviceEventEmitter.emit('triggerNewPostOverlay')} icon={<Plus />} />,
            label: 'Upload',
            active: false,
        },
        {
            icon: <Heart />,
            label: 'List',
            active: false
        },
        {
            icon: <UserCircle size={24} source={user?.getImageSource()} />,
            label: 'User',
            active: false
        },
    ] as const;

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                borderTopWidth: 2,
                borderColor: palette.granite,
                backgroundColor: palette.black,
                height: constants.TABBAR_HEIGHT,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: width,
            },
            item: {
                width: width / 5,
                height: constants.TABBAR_HEIGHT,
                justifyContent: 'center',
                alignItems: 'center'
            }
        })
    }, []);

    const pathname = usePathname()

    const handlePress = useCallback((item: typeof items[number], focused: boolean) => () => {



        /**
         * This switch statement handles side effects per route. Default routing behaviour is specified below.
         */
        switch(item.label) {
            case "Upload": {
                return DeviceEventEmitter.emit('triggerNewPostOverlay')
            }

            case "User": {
                if(pathname === `/user/${user?.getID()}`) return

                return user
                    ? router.push(`/(tabs)/(user)/user/${user.getID()}`)
                    : router.push('/auth')
            }
        }

        const event = navigation.emit({
            type: 'tabPress',
            target: mappedRoutes[item.label as keyof typeof mappedRoutes].key,
            canPreventDefault: true,
        })

        if(item.label === "Feed" && focused) {
            DeviceEventEmitter.emit('feed:top')
        }

        if (!event.defaultPrevented && !focused) {
            navigation.navigate({ name: mappedRoutes[item.label as keyof typeof mappedRoutes].name, merge: true, params : {} });
        }
    }, [user, navigation, mappedRoutes, router, pathname])

    return (
        <View style={styles.wrapper}>
            { _.map(items, (item, index) => (
                <Pressable onPress={handlePress(item, currentlyFocusedIndex === index)} style={styles.item} key={index}>
                    {item.icon}
                </Pressable>
            ))}
        </View>
    )
}

export default BottomNavigation