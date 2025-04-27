import {RefreshControl, ScrollView, ScrollViewProps, StyleSheet} from 'react-native'
import {useMemo} from "react";

interface ScrollProps extends ScrollViewProps {
    refreshing?: boolean
    onRefresh?: () => void
    disableRefresh?: boolean
}

const Scroll = ({children, onRefresh, refreshing, disableRefresh, ...rest}: ScrollProps) => {

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
        })
    }, []);

    const RefreshControlComponent = useMemo(() => (
        <RefreshControl onRefresh={onRefresh} refreshing={Boolean(refreshing)} />
    ), [onRefresh, refreshing, disableRefresh])

    return(
        <ScrollView
            {...rest}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            refreshControl={disableRefresh ? undefined : RefreshControlComponent}>
            {children}
        </ScrollView>
    )
}

export default Scroll