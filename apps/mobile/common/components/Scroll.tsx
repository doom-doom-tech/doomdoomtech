import {RefreshControl, ScrollViewProps} from 'react-native';
import {useMemo} from 'react';
import Animated from 'react-native-reanimated';

interface ScrollProps extends ScrollViewProps {
    refreshing?: boolean;
    onRefresh?: () => void;
    disableRefresh?: boolean;
}

const Scroll = ({ children, onRefresh, refreshing, disableRefresh, ...rest }: ScrollProps) => {

    const RefreshControlComponent = useMemo(
        () => <RefreshControl onRefresh={onRefresh} refreshing={Boolean(refreshing)} />,
        [onRefresh, refreshing, disableRefresh]
    );

    return (
        <Animated.ScrollView
            {...rest}
            scrollEventThrottle={16}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            refreshControl={disableRefresh ? undefined : RefreshControlComponent}
        >
            {children}
        </Animated.ScrollView>
    );
};

export default Scroll;