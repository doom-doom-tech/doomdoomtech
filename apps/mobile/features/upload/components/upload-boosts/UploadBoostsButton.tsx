import {StyleSheet, TouchableOpacity, View} from 'react-native'
import {ReactElement, useCallback, useEffect, useMemo} from "react";
import {palette, spacing} from "@/theme";
import Text from "@/common/components/Text";
import Check from "@/assets/icons/Check";
import Plus from "@/assets/icons/Plus";
import {useUploadStore} from "@/features/upload/store/upload";
import {useUploadSettings} from "@/features/upload/store/upload-settings";

interface UploadBoostsButtonsProps {
    icon: ReactElement
    label: string
    field: string
    subtitle: string
    active: boolean
}

const UploadBoostsButton = ({icon, field, label, subtitle, active}: UploadBoostsButtonsProps) => {

    const { premiumEnabled } = useUploadSettings()
    const { boosts, actions } = useUploadStore()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                padding: spacing.m,
                flexDirection: 'row',
                justifyContent: 'space-between',
                backgroundColor: palette.darkgrey + '80',
            },
            icon: {
                width: 50,
                height: 50,
                padding: spacing.s,
                alignItems: 'center',
                borderRadius: 8,
                justifyContent: 'center',
                backgroundColor: palette.purple
            },
            label: {
                fontSize: 18,
                color: palette.offwhite,
            },
            subtitle: {
                fontSize: 12,
                color: palette.granite,
            },
            content: {
                width: '60%',
            },
            left: {
                gap: spacing.m,
                flexDirection: 'row'
            },
            right: {
                width: 50,
                height: 50,
                padding: spacing.s,
                alignItems: 'center',
                borderRadius: 8,
                justifyContent: 'center',
                backgroundColor: active ? palette.olive : palette.rose
            }
        })
    }, [active]);

    const toggleBoost = useCallback(() => {
        if(!premiumEnabled) return
        actions.setState({ boosts: { ...boosts, [field]: !active }})
    }, [boosts, premiumEnabled])

    useEffect(() => {
        if(!premiumEnabled) actions.setState({
            boosts: {
                mastering: false,
            }
        })
    }, [premiumEnabled])

    return(
        <View style={styles.wrapper}>
            <View style={styles.left}>
                <View style={styles.icon}>
                    { icon }
                </View>
                <View style={styles.content}>
                    <Text style={styles.label}>{label}</Text>
                    <Text style={styles.subtitle}>{subtitle}</Text>
                </View>
            </View>
            <TouchableOpacity style={styles.right} onPress={toggleBoost}>
                { active ? <Check color={palette.black} /> : <Plus /> }
            </TouchableOpacity>
        </View>
    )
}

export default UploadBoostsButton