import {StyleSheet, useWindowDimensions, View} from 'react-native';
import {useEffect, useRef} from 'react';
import LottieView from 'lottie-react-native';
import Animated, {useAnimatedProps, useSharedValue, withTiming} from 'react-native-reanimated';
import Coins from '@/assets/icons/Coins';
import Text from '@/common/components/Text';
import {palette} from '@/theme';
import {Audio} from 'expo-av';
import useGlobalUserContext from '@/features/user/hooks/useGlobalUserContext';

interface CreditProgressProps {}

const AnimatedLottieView = Animated.createAnimatedComponent(LottieView);

const CreditProgress = ({}: CreditProgressProps) => {
    const user = useGlobalUserContext();

    const animationReference = useRef<LottieView>(null);

    const progress = useSharedValue(0);
    const amount = useSharedValue(0);

    const { width } = useWindowDimensions();

    const styles = StyleSheet.create({
        wrapper: {
            position: 'relative',
            justifyContent: 'center',
            alignItems: 'center',
        },
        content: {
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
            top: '35%',
        },
        amount: {
            color: palette.offwhite,
            fontSize: 24,
            fontWeight: 'bold',
        },
    });

    useEffect(() => {
        (async () => {
            const { sound } = await Audio.Sound.createAsync(require('@/assets/sounds/coins.wav'));
            progress.value = withTiming((user?.getCreditValue() ?? 0) / 500, { duration: 1000 });
            await sound.playAsync();
        })();
    }, []);

    const animatedProgressProps = useAnimatedProps(() => ({
        progress: progress.value * 0.6, // Use the animated progress value
    }));

    return (
        <View style={styles.wrapper}>
            <AnimatedLottieView
                animatedProps={animatedProgressProps}
                ref={animationReference}
                resizeMode={'cover'}
                style={{ height: width * 0.6, width: width * 0.6 }}
                source={require('@/assets/animations/progress.json')}
            />
            <View style={styles.content}>
                <Coins />
                <Text style={styles.amount}>
                    {user?.getCreditValue().toFixed(2)} | 500
                </Text>
            </View>
        </View>
    );
};

export default CreditProgress;