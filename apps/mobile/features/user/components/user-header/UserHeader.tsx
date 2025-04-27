import {Dimensions, LayoutChangeEvent, StyleSheet, View} from 'react-native'
import {Fragment, useCallback, useMemo, useRef, useState} from "react";
import UserHeaderNavigation from "@/features/user/components/user-header/UserHeaderNavigation";
import {ImageBackground} from "expo-image";
import useSingleUserContext from "@/features/user/hooks/useSingleUserContext";
import UserHeaderContent from "@/features/user/components/user-header/UserHeaderContent";
import UserHeaderMetrics from "@/features/user/components/user-header/UserHeaderMetrics";
import {palette, spacing} from "@/theme";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import DefaultHeader from "@/assets/images/default-header.png"

const { width: screenWidth } = Dimensions.get("window");

const UserHeader = () => {

    const user = useSingleUserContext()

    const { top } = useSafeAreaInsets()

    const viewWrapperReference = useRef(null)

    const [contentHeight, setContentHeight] = useState<number>(0)

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                gap: spacing.m,
                paddingBottom: 16,
                paddingTop: top,
            },
            background: {
                position: 'absolute',
                top: -top,
                width: screenWidth,
                height: contentHeight + top,
                opacity: 0.5
            },
            pane: {
                position: 'absolute',
                top: -top,
                width: screenWidth,
                height: contentHeight + top,
                backgroundColor: palette.black
            },
            overlay: {
                position: 'absolute',
                top: -top,
                backgroundColor: palette.black,
                width: screenWidth,
                height: contentHeight + top,
                opacity: 0.5
            }
        })
    }, [contentHeight]);

    const handleLayoutChangeEvent = useCallback((event: LayoutChangeEvent) => {
        setContentHeight(event.nativeEvent.layout.height)
    }, [])

    const Background = useCallback(() => {
        if(user.getBannerSource()) return (
            <Fragment>
                <ImageBackground
                    style={styles.background}
                    source={user.getBannerSource()}
                />
                <View
                    style={styles.overlay}
                />
            </Fragment>
        )
        return (
            <Fragment>
                <ImageBackground
                    style={styles.background}
                    source={DefaultHeader}
                />
                <View
                    style={styles.overlay}
                />
            </Fragment>
        )
    }, [user, styles])

    return(
        <View style={styles.wrapper} onLayout={handleLayoutChangeEvent} ref={viewWrapperReference}>
            <Background />
            <UserHeaderNavigation />
            <UserHeaderContent />
            <UserHeaderMetrics />
        </View>
    )
}

export default UserHeader