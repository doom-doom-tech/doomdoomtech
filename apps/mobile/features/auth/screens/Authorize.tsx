import {StyleSheet, TextInput, TouchableOpacity, useWindowDimensions, View} from 'react-native';
import {useCallback, useMemo, useRef, useState} from "react";
import {palette, spacing} from "@/theme";
import AuthenticateHeader from "@/features/auth/components/AuthenticateHeader";
import Input from "@/common/components/inputs/Input";
import _ from 'lodash';
import useAuthVerifyCode from "@/features/auth/hooks/useAuthVerifyCode";
import Toast from "react-native-root-toast";
import {TOASTCONFIG} from "@/common/constants";
import {useAuthStoreSelectors} from "@/features/auth/store/auth";
import {router} from "expo-router";
import {formatServerErrorResponse, wait} from "@/common/services/utilities";
import useSessionRequest from "@/common/hooks/useSessionRequest";
import {usePaymentContext} from "@/common/context/PaymentContextProvider";
import Text from "@/common/components/Text";
import Animated, {interpolateColor, useAnimatedStyle, useSharedValue, withSequence, withTiming} from 'react-native-reanimated';

const Authenticate = () => {
    const { width } = useWindowDimensions();
    const inputReference = useRef<TextInput>(null);
    const refreshSessionMutation = useSessionRequest();

    const paddingHorizontal = 16 * 2; // Left + Right padding
    const totalGapWidth = (6 - 1) * spacing.s; // 5 gaps of 8px each
    const boxWidth = (width - paddingHorizontal - totalGapWidth) / 6;
    const boxHeight = boxWidth * 1.5;

    // Shared values for animations
    const shakeX = useSharedValue(0);
    const borderColorAnim = useSharedValue(0); // 0 = normal, 1 = error state

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                flex: 1,
                gap: spacing.m,
                backgroundColor: palette.black
            },
            input: {
                marginTop: spacing.m,
                textAlign: 'center',
                padding: 16,
                fontSize: 32,
                color: palette.offwhite,
                borderColor: palette.granite,
                borderWidth: 2
            },
            boxes: {
                flexDirection: 'row',
                gap: spacing.s,
                paddingHorizontal: spacing.m,
            },
            box: {
                borderWidth: 2,
                borderRadius: 4,
                height: boxHeight,
                width: boxWidth,
                justifyContent: 'center',
                alignItems: 'center',
            },
            number: {
                fontSize: 64,
                lineHeight: 64,
                fontWeight: 'bold',
                color: palette.olive,
            }
        })
    }, []);

    const email = useAuthStoreSelectors.email();
    const setAuthState = useAuthStoreSelectors.setState();
    const verifyAuthCodeMutation = useAuthVerifyCode();

    const { logInWithRevenueCat, setDisplayName, setEmail } = usePaymentContext();
    const [code, setCode] = useState<string>("");

    // Shake animation style
    const animatedBoxStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: shakeX.value }],
    }));

    // Border color animation style
    const animatedBorderStyle = useAnimatedStyle(() => ({
        borderColor: interpolateColor(
            borderColorAnim.value,
            [0, 1],
            [palette.granite, palette.error]
        ),
    }));

    const handleSubmit = useCallback(async (code: string) => {
        try {
            if (email === undefined) {
                router.back();
                await wait(200);
                return Toast.show('Something went wrong with the login process', TOASTCONFIG.error);
            }

            const { user } = await verifyAuthCodeMutation.mutateAsync({
                code: String(code), email: email as string
            });

            await setDisplayName(user.getUsername());
            await setEmail(email);

            // Update the authorized state
            setAuthState({ authorized: true });

            // Refresh the user session if needed
            refreshSessionMutation.mutate();

            await logInWithRevenueCat(user.getID().toString());

            router.back();
            await wait(200);
            Toast.show("Logged in", TOASTCONFIG.success);
        } catch (error: any) {
            setCode("");

            // Shake effect when error occurs
            shakeX.value = withSequence(
                withTiming(-10, { duration: 50 }),
                withTiming(10, { duration: 50 }),
                withTiming(-8, { duration: 50 }),
                withTiming(8, { duration: 50 }),
                withTiming(-5, { duration: 50 }),
                withTiming(5, { duration: 50 }),
                withTiming(0, { duration: 50 })
            );

            // Change border color to error state
            borderColorAnim.value = withTiming(1, { duration: 300 });

            // Reset border color after 2 seconds
            setTimeout(() => {
                borderColorAnim.value = withTiming(0, { duration: 300 });
            }, 1000);

            Toast.show(formatServerErrorResponse(error), TOASTCONFIG.error);
        }
    }, [email]);

    const triggerInputFocus = useCallback(() => {
        inputReference.current?.focus();
    }, []);

    const handleEnterCode = useCallback(async (value: string) => {
        const numericValue = value.replace(/[^0-9]/g, "");
        setCode(numericValue);
        if (numericValue.length === 6) await handleSubmit(numericValue);
    }, [code]);

    return (
        <View style={styles.wrapper}>
            <AuthenticateHeader title={"Enter the code that was sent to your email"} />

            <Animated.View style={[styles.boxes, animatedBoxStyle]}>
                {_.map(Array(6).fill(0), (x, index) => (
                    <TouchableOpacity key={index} onPress={triggerInputFocus}>
                        <Animated.View style={[styles.box, animatedBorderStyle]}>
                            <Text style={styles.number}>
                                {code[index] || ""}
                            </Text>
                        </Animated.View>
                    </TouchableOpacity>
                ))}
            </Animated.View>

            <Input
                ref={inputReference}
                wrapperStyle={{ opacity: 0 }}
                value={code}
                onChangeText={handleEnterCode}
                style={styles.input}
                autoCapitalize="characters"
                keyboardType="number-pad"
                maxLength={6}
            />
        </View>
    );
};

export default Authenticate;