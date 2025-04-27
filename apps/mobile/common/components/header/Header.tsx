import {StyleSheet} from 'react-native'
import {Fragment, ReactElement, useMemo} from "react";
import {Header as NativeHeader} from "@react-navigation/elements";
import {palette, spacing} from "@/theme";

interface HeaderProps {
    title?: string
    height?: number
    premium?: boolean
    fontSize?: number
    hideBackButton?: boolean
    TitleComponent?: () => ReactElement
    RightComponent?: () => ReactElement
}

const Header = ({title, height, hideBackButton, TitleComponent, RightComponent, fontSize = 16}: HeaderProps) => {

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                paddingHorizontal: spacing.m,
            },
        });
    }, [height]);

    return(
        <NativeHeader
            title={title ?? ''}
            headerTitleStyle={{ fontSize }}
            headerStatusBarHeight={spacing.m}
            headerTitleAlign="center"
            headerTitleContainerStyle={{ justifyContent: 'center' }}
            headerTitle={TitleComponent}
            headerRight={RightComponent}
            back={hideBackButton ? undefined : { title: '', href: '../' }}
            headerTintColor={palette.offwhite}
            headerBackground={() => <Fragment />}
            headerLeftContainerStyle={styles.wrapper}
            headerRightContainerStyle={styles.wrapper}
        />
    )
}

export default Header