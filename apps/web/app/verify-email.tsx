import {useLocalSearchParams} from "expo-router";
import Screen from "@/common/components/Screen";
import useVerifyEmail from "@/features/auth/hooks/useVerifyEmail";
import {useCallback, useEffect, useState} from "react";
import {formatServerErrorResponse} from "@/common/services/utilities";
import {ActivityIndicator, StyleSheet, useWindowDimensions, View} from "react-native";
import Text from "@/common/components/Text";
import {palette, spacing} from "@/theme";
import CheckCircle from "@/assets/icons/CheckCircle";
import ErrorCircle from "@/assets/icons/ErrorCircle";

const VerifyEmail = () => {

    const { height } = useWindowDimensions()

    const styles = StyleSheet.create({
        wrapper: {
            height,
            justifyContent: 'center',
            alignItems: 'center',
            gap: spacing.m,
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            textAlign: 'center'
        },
        errorBox: {
            padding: spacing.m,
            backgroundColor: palette.granite,
            borderRadius: 8
        },
        link: {
            color: palette.rose
        }
    })

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string>()

    const { token, email } = useLocalSearchParams()

    const verifyEmailMutation = useVerifyEmail()

    const handleVerifyEmail = useCallback(async () => {
        try {
            await verifyEmailMutation.mutateAsync({
                email: email as string, token: token as string
            })
        } catch (e: any) {
            throw e
        }
    }, [email, token, verifyEmailMutation])

    useEffect(() => {
        handleVerifyEmail()
            .then(() => {
                setError(undefined)
            })
            .catch(e => {
                setError(formatServerErrorResponse(e))
            })
            .finally(() => {
                setLoading(false)
            })
    }, []);

    const LoadingView = useCallback(() => (
        <Screen>
            <View style={styles.wrapper}>
                <ActivityIndicator size={'large'}/>
                <Text style={styles.title}>Verifying your email.. hold tight</Text>
            </View>
        </Screen>
    ), [])

    const ApprovedView = useCallback(() => (
        <Screen>
            <View style={styles.wrapper}>
                <CheckCircle color={palette.olive} width={36} height={36} />
                <Text style={styles.title}>Your email is verified. You may now close this window</Text>
            </View>
        </Screen>
    ), [])

    const DeclinedView = useCallback(() => (
        <Screen>
            <View style={styles.wrapper}>
                <ErrorCircle color={palette.error} width={36} height={36} />
                <Text style={styles.title}>There was a problem verifying your email:</Text>
                <View style={styles.errorBox}>
                    <Text>{error}</Text>
                </View>
            </View>
        </Screen>
    ), [error])

    if(loading) return <LoadingView />
    if(error) return <DeclinedView />
    return <ApprovedView />
}

export default VerifyEmail