import {DeviceEventEmitter, StyleSheet, Text, View} from 'react-native'
import {Fragment, useCallback, useMemo, useState} from "react";
import {LoginRequest, RegistrationRequest} from "@/features/auth/types/auth";
import Form, {FormChangeHandler} from "@/common/components/form/Form";
import * as Yup from "yup";
import Input from "@/common/components/inputs/Input";
import Toast from "react-native-root-toast";
import _ from "lodash";
import {TOASTCONFIG} from "@/common/constants";
import SwitchConsent from "@/common/components/consent/SwitchConsent";
import {palette, spacing} from "@/theme";
import RadioConsent from "@/common/components/consent/RadioConsent";
import {formatServerErrorResponse} from "@/common/services/utilities";
import useAuthRegister from "@/features/auth/hooks/useAuthRegister";
import {router} from "expo-router";
import Hashtag from "@/assets/icons/Hashtag";

interface RegisterFormProps {

}

const RegisterForm = ({}: RegisterFormProps) => {

    const registerMutation = useAuthRegister()

    const [inviteCode, setInviteCode] = useState<string | null>(null)

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
            input: {
                paddingHorizontal: spacing.m
            },
            consents: {
                gap: spacing.m,
            }
        })
    }, []);

    const [initialValues, setInitialValues] = useState<RegistrationRequest & { terms: boolean }>({
        email: '',
        code: null,
        username: '',
        label: false,
        terms: false,
        newsletter: false,
    })

    const validationSchema = Yup.object<LoginRequest>({
        email: Yup.string()
            .required('Email is required')
            .email("Email format is invalid"),
        username: Yup.string()
            .required('Username is required')
            .max(15, 'A username can be 15 characters max')
            .matches(/^[a-zA-Z]+$/, "The string must contain letters (a-z or A-Z) only")
    })

    const handleRouteTerms = useCallback(() => {
        router.push('/terms-of-service')
    }, [])

    const handleRoutePolicy = useCallback(() => {
        router.push('/privacy-policy')
    }, [])

    const Content = useCallback((handleChange: FormChangeHandler, formData: RegistrationRequest & { terms: boolean }) => (
        <Fragment>
            <Input
                wrapperStyle={styles.input}
                value={formData.code}
                placeholder={'Invite code (optional)'}
                onChangeText={handleChange('code')}
                autoComplete="off"
                autoCapitalize="none"
            />

            <Input
                wrapperStyle={styles.input}
                value={formData.email}
                placeholder={'Email'}
                onChangeText={handleChange('email')}
                autoComplete="off"
                autoCapitalize="none"
            />

            <Input
                wrapperStyle={styles.input}
                value={formData.username}
                placeholder={'Username'}
                onChangeText={(value: string) => handleChange('username')(value.toLowerCase().replaceAll(' ', ''))}
                autoComplete="off"
                autoCapitalize="none"
            />

            <View style={styles.consents}>
                <SwitchConsent
                    icon={<Hashtag color={palette.offwhite} />}
                    label={"Register as a label"}
                    value={formData.label}
                    callback={handleChange('label')}
                />

                <RadioConsent
                    value={formData.newsletter}
                    callback={handleChange('newsletter')}>
                    <Text style={{ color: palette.offwhite, maxWidth: '90%' }}>
                        Stay on beat with exclusive content and promotions via our newsletter
                    </Text>
                </RadioConsent>

                <RadioConsent
                    value={formData.terms}
                    callback={handleChange('terms')}>
                    <Text style={{ color: palette.offwhite, maxWidth: '90%' }}>
                        I accept the <Text style={{ color: palette.rose }} onPress={handleRouteTerms}>terms and conditions</Text> and <Text style={{ color: palette.rose }} onPress={handleRoutePolicy}>privacy policy</Text>
                    </Text>
                </RadioConsent>
            </View>
        </Fragment>
    ), [inviteCode]);

    const handleErrors = useCallback((errors: Array<Record<string, string>>) => {
        errors.length && Toast.show(_.get(_.first(errors), 'error', ''), TOASTCONFIG.error)
    }, [])

    const handleSubmitRegistration = useCallback(async (values: RegistrationRequest) => {
        try {
            await registerMutation.mutateAsync(values)

            DeviceEventEmitter.emit('auth:index:login')
            Toast.show("Registration complete. Please verify your email")
        } catch (error: any) {
            Toast.show(formatServerErrorResponse(error), TOASTCONFIG.error)
        }
    }, [inviteCode])

    return(
        <View style={styles.wrapper}>
            <Form
                <RegistrationRequest & { terms: boolean }>
                initialValues={initialValues}
                label={'Register'}
                validationSchema={validationSchema}
                onSubmit={handleSubmitRegistration}
                onError={handleErrors}
                content={Content}
            />
        </View>
    )
}

export default RegisterForm