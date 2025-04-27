import {StyleSheet, TouchableOpacity} from 'react-native'
import {ReactElement, useCallback, useMemo} from "react";
import {palette, spacing} from "@/theme";
import Icon from "@/common/components/icon/Icon";
import {WithChildren} from "@/common/types/common";

interface SwitchConsentProps extends WithChildren {
    icon?: ReactElement
    value: boolean
    callback: (value: boolean) => void
}

const RadioConsent = ({icon, value, callback, children}: SwitchConsentProps) => {

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: spacing.m,
                gap: spacing.m,
            },
            label: {
                maxWidth: '90%',
                color: palette.offwhite
            }
        })
    }, []);

    const handlePress = useCallback(() => {
        callback(!value)
    }, [value])

    return(
        <TouchableOpacity style={styles.wrapper} onPress={handlePress}>
            { value 
                ? <Icon name={'radio-btn-active'} pack={'fontisto'} color={'olive'} />
                : <Icon name={'radio-btn-passive'} pack={'fontisto'} color={'offwhite'} />
            }
            {children}
        </TouchableOpacity>
    )
}

export default RadioConsent