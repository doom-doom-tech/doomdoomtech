import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { palette } from '@/theme';
import Bell from '@/assets/icons/Bell';
import { router } from 'expo-router';
import useAlertCount from '@/features/alert/hooks/useAlertCount';
import useGlobalUserContext from '@/features/user/hooks/useGlobalUserContext';
import Text from '@/common/components/Text';
import millify from 'millify';
import useEventListener from '@/common/hooks/useEventListener';

const AlertBell = () => {
    const { data: alertCount } = useAlertCount();
    const user = useGlobalUserContext();
    const [count, setCount] = useState<number | undefined>(alertCount);

    // Sync count with alertCount when it changes
    useEffect(() => {
        setCount(alertCount);
    }, [alertCount]);

    // Handle navigation to alerts or auth
    const routeAlerts = useCallback(() => {
        if (!user) {
            router.push('/auth');
            return;
        }
        router.push('/alerts');
    }, [user]);

    // Event listener for resetting count
    useEventListener('alerts:count:reset', () => setCount(0));

    // Ensure millify output is a string to avoid rendering issues
    const formattedCount = typeof count === 'number' && count > 0 ? millify(count) : null;

    return (
        <TouchableOpacity
            onPress={routeAlerts}
            style={styles.wrapper}
            accessibilityLabel={`Alerts, ${count || 0} unread`}
            accessibilityRole="button"
        >
            <Bell color={palette.offwhite} />
            {formattedCount && (
                <View style={styles.notify}>
                    <Text style={styles.count}>{formattedCount}</Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        position: 'relative',
    },
    notify: {
        position: 'absolute',
        bottom: -4,
        alignSelf: 'center',
        paddingHorizontal: 2,
        backgroundColor: palette.error,
        borderRadius: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    count: {
        fontSize: 8,
        color: palette.offwhite,
    },
});

export default AlertBell;