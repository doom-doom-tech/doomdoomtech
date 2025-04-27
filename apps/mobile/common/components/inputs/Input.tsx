import {StyleSheet, TextInput, TextInputProps, TouchableOpacity, View} from 'react-native'
import {forwardRef, useMemo} from "react";
import {palette, spacing} from "@/theme";
import {ViewStyle} from "react-native/Libraries/StyleSheet/StyleSheetTypes";
import Clear from "@/assets/icons/Clear";
import Text from "@/common/components/Text";

interface InputProps extends TextInputProps {
    onClear?: () => unknown
    label?: string
    inputStyle?: ViewStyle;
    wrapperStyle?: ViewStyle;
}

const Input = forwardRef((props: InputProps, reference) => {

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                ...props.wrapperStyle,
                gap: spacing.s
            },
            input: {
                padding: 20,
                borderColor: palette.granite,
                backgroundColor: palette.black,
                borderWidth: 2,
                color: palette.offwhite,
                ...props.inputStyle
            },
            clear: {
                position: 'absolute',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                width: 50,
                right: 0,
                top: 0
            },
            label: {
                color: palette.granite,
            }
        })
    }, [props]);

    return(
        <View style={styles.wrapper}>

            {props.label && (
                <Text style={styles.label}>
                    {props.label}
                </Text>
            )}

            <TextInput
                {...props}
                ref={reference}
                autoCorrect={false}
                autoCapitalize={"none"}
                autoComplete={"off"}
                style={styles.input}
                placeholderTextColor={palette['granite']}
            />

            { props.value && props.onClear && (
                <TouchableOpacity style={styles.clear} onPress={props.onClear}>
                    <Clear color={palette.offwhite} />
                </TouchableOpacity>
            )}
        </View>
    )
})

export default Input