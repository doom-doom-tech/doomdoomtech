import {StyleProp, View} from 'react-native'
import {ViewStyle} from 'react-native/Libraries/StyleSheet/StyleSheetTypes'
import {Fragment, ReactElement, ReactNode, useCallback, useState} from 'react'
import Yup, {AnyObject, Maybe, ValidationError} from 'yup'
import _ from 'lodash'
import {spacing} from "@/theme";
import useEventListener from "@/common/hooks/useEventListener";
import Button from "@/common/components/buttons/Button";

interface FormProps<T extends Maybe<AnyObject>> {
    label: string
    onSubmit: (values: T) => unknown
    validationSchema: Yup.ObjectSchema<any>
    initialValues: T
    FooterComponent?: (values: T) => ReactElement
    onError: (errors: Array<Record<'field' | 'error', string>>) => unknown
    content: (handleChange: (field: string) => (value: any) => unknown, formData: T) => ReactNode | Array<ReactNode>
}

export type FormChangeHandler = (field: string) => (value: string | boolean) => unknown

export const extractInputErrorString = (field: string, errors: Array<Record<string, string>>) => {
    const fieldError = _.find(errors, { field })
    if(_.isEmpty(errors) || _.isUndefined(fieldError)) return undefined
    return _.get(fieldError, 'error',  '')
}

const Form = <T extends Record<string, any>>({ label, content, onSubmit, onError, validationSchema, initialValues, FooterComponent = () => <Fragment /> }: FormProps<T>) => {

    const [formData, setFormData] = useState<T>(initialValues)
    const [loading, setLoading] = useState<boolean>(false)

    const styles: Record<string, StyleProp<ViewStyle>> = {
        wrapper : {
            width: '100%',
            gap: spacing.m,
            display: 'flex',
            flexDirection: 'column'
        },
        button: {
            flexGrow: 0
        }
    }

    const validateFormData = useCallback(async () => {
        try {
            await validationSchema.validate(formData, { abortEarly: false })
        } catch (validationErrors: any) {
            throw _.map(validationErrors.inner, (error: ValidationError) => ({
                field: error.path as string,
                error: _.first(error.errors) as string
            }))
        }
    }, [validationSchema, formData])

    const handleSubmit = useCallback(async () => {
        setLoading(true)

        // Reset errors
        onError([])

        // Validate data
        try { await validateFormData() } catch (e: any) { setLoading(false); return onError(e) }

        // Submit
        await onSubmit(formData)

        setLoading(false)
    }, [formData, onSubmit, onError, validateFormData])

    const handleChange = (field: string) => (value: any) => {
        setFormData((prevData) => _.update(_.cloneDeep(prevData), field, () => value))
    }

    useEventListener('form:update', entry => {
        const [key] = Object.keys(entry)
        const value = entry[key]
        handleChange(key)(value)
    });

    return(
        <View style={styles.wrapper}>
            { content(handleChange, formData) }
            <Button
                loading={loading}
                label={label}
                callback={handleSubmit}
            />
            { FooterComponent(formData) }
        </View>
    )
}

export default Form

