import {Keyboard, StyleSheet, Text, useWindowDimensions, View} from 'react-native'
import {Fragment, useCallback, useEffect, useMemo, useState} from "react";
import Form, {FormChangeHandler} from "@/common/components/form/Form";
import Input from "@/common/components/inputs/Input";
import {LoginRequest} from "@/features/auth/types/auth";
import * as Yup from "yup";
import Toast from 'react-native-root-toast'
import _ from "lodash";
import {TOASTCONFIG} from "@/common/constants";
import {formatServerErrorResponse, wait} from "@/common/services/utilities";
import useAuthRequestCode from "@/features/auth/hooks/useAuthRequestCode";
import {useAuthStoreSelectors} from "@/features/auth/store/auth";
import {router} from "expo-router";
import useRequestVerificationEmail from "@/features/auth/hooks/useRequestVerificationEmail";
import {palette, spacing} from "@/theme";
import SocialLogins from "@/features/auth/components/socials/SocialLogins";
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginForm = () => {

    const {width} = useWindowDimensions()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                height: 500,
                width: width,
            },
            action: {
                color: palette.rose,
                textAlign: 'center'
            },
            input: {
                paddingHorizontal: spacing.m
            }
        })
    }, []);

    const requestAuthCodeMutation = useAuthRequestCode()
    const requestVerifyEmailMutation = useRequestVerificationEmail()

    const setAuthState = useAuthStoreSelectors.setState()

    const handleErrors = useCallback((errors: Array<Record<string, string>>) => {
        errors.length && Toast.show(_.get(_.first(errors), 'error', ''), TOASTCONFIG.error)
    }, [])

    const [initialValues, setInitialValues] = useState({
        email: '',
    })

    useEffect(() => {
        const loadSavedEmail = async () => {

            console.log(await AsyncStorage.getItem('savedEmail'))

            const savedEmail = await AsyncStorage.getItem('savedEmail')
            if (savedEmail) {
                setInitialValues({email: savedEmail})
            }
        }

        console.log('loading saved email')


        loadSavedEmail()
    }, [])

    const validationSchema = Yup.object<LoginRequest>({
        email: Yup.string()
            .required('Email is required')
            .email("Email format is invalid"),
    })

    const Content = useCallback((handleChange: FormChangeHandler, formData: LoginRequest) => (
        <Fragment>
            <Input
                wrapperStyle={styles.input}
                value={formData.email}
                placeholder={'Email or username'}
                onChangeText={handleChange('email')}
                autoComplete="off"
                autoCapitalize="none"
            />
        </Fragment>
    ), [initialValues]);

    const FooterComponent = useCallback((formData: LoginRequest) => (
        <Fragment>
            <Text style={styles.action} onPress={handleRequestVerificationMail(formData)}>
                Resend verification mail
            </Text>
        </Fragment>
    ), []);

    const handleRequestLoginCode = useCallback(async (values: LoginRequest) => {
        try {
            Keyboard.dismiss()

            await requestAuthCodeMutation.mutateAsync(values)

            setAuthState({email: values.email})
            await AsyncStorage.setItem('savedEmail', values.email)

            router.back()
            await wait(200)
            router.push('/(sheets)/login-code')
        } catch (error: any) {
            Toast.show(formatServerErrorResponse(error), TOASTCONFIG.error)
        }
    }, [])

    const handleRequestVerificationMail = useCallback((values: LoginRequest) => async () => {
        try {
            Keyboard.dismiss()

            if (!values.email) return Toast.show("Enter your email", TOASTCONFIG.error)

            await requestVerifyEmailMutation.mutateAsync({
                email: values.email
            })

            Toast.show('Email sent. Check your inbox', TOASTCONFIG.success)
        } catch (error: any) {
            Toast.show(formatServerErrorResponse(error.message), TOASTCONFIG.error)
        }
    }, [])

    console.log(initialValues)

    return (
        <View style={styles.wrapper}>
            <Form
                <LoginRequest>
                key={initialValues.email}
                content={Content}
                label={'Request code'}
                onError={handleErrors}
                initialValues={initialValues}
                onSubmit={handleRequestLoginCode}
                FooterComponent={FooterComponent}
                validationSchema={validationSchema}
            />
            <SocialLogins/>
        </View>
    )
}

export default LoginForm