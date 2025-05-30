import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import {palette} from '@/theme';

interface ShrinkDownProps {
    onComplete?: () => void;
    duration?: number;
}

const ShrinkDown: React.FC<ShrinkDownProps> = ({
    onComplete,
    duration = 10000
}) => {
    const progressAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.timing(progressAnim, {
            toValue: 0,
            duration: duration,
            useNativeDriver: false
        }).start(({ finished }) => {
            if (finished && onComplete) {
                onComplete();
            }
        });
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.backgroundBar} />
            <Animated.View
                style={[
                    styles.progressBar,
                    {
                        width: progressAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0%', '100%']
                        })
                    }
                ]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 4,
        width: '100%',
        backgroundColor: palette.grey,
        overflow: 'hidden'
    },
    backgroundBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: palette.grey
    },
    progressBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        backgroundColor: palette.olive
    }
});

export default ShrinkDown;
