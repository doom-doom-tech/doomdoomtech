import {StyleSheet, TouchableOpacity} from "react-native";
import {ReactElement, useCallback, useEffect} from "react";
import {palette, spacing} from "@/theme";
import Animated, {FadeInDown, FadeInUp, FadeOutDown, FadeOutUp, useAnimatedStyle, useSharedValue, withTiming,} from "react-native-reanimated";

interface IconLabelProps {
    direction?: "row" | "column";
    icon: ReactElement;
    label: string;
    callback: () => void;
}

const IconLabel = ({ direction = "row", icon, label, callback }: IconLabelProps) => {
    const styles = StyleSheet.create({
        wrapper: {
            flexDirection: direction,
            alignItems: "center",
            gap: spacing.s,
        },
        label: {
            color: palette.offwhite,
            fontWeight: "600",
        },
    });

    const animationProgress = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: animationProgress.value }],
    }));

    useEffect(() => {
        animationProgress.value = withTiming(1.2, { duration: 150 }, () => {
            animationProgress.value = withTiming(1);
        });
    }, [animationProgress]);

    const LabelComponent = useCallback(
        () => (
            <Animated.Text exiting={FadeOutUp} entering={FadeInDown} style={styles.label}>
                {label}
            </Animated.Text>
        ),
        [label]
    );

    return (
        <TouchableOpacity style={styles.wrapper} onPress={callback}>
            {/* Wrapper for Layout Animation */}
            <Animated.View entering={FadeInUp} exiting={FadeOutDown}>
                {/* Keep `transform` animations inside */}
                <Animated.View style={animatedStyle}>{icon}</Animated.View>
            </Animated.View>
            <LabelComponent />
        </TouchableOpacity>
    );
};

export default IconLabel;