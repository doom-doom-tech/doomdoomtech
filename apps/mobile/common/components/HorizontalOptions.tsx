import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {useCallback, useMemo} from "react";
import {palette, spacing} from "@/theme";
import _ from 'lodash';

export type Option<Value> = {
    label: string
    value: Value
}

interface HorizontalOptionsProps<T> {
    label: string
    selected: (item: T) => boolean
    onSelect: (value: T) => unknown
    options: Array<Option<T>>
}

const HorizontalOptions = <T extends any>({label, options, selected, onSelect}: HorizontalOptionsProps<T>) => {

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                gap: spacing.s
            },
            container: {
                gap: spacing.s
            },
            label: {
                color: palette.offwhite
            }
        })
    }, []);

    const handleSelect = useCallback((value: T) => () => {
        onSelect(value)
    }, [onSelect])

    const itemStyles = useCallback((value: T) => ({
        padding: spacing.s,
        backgroundColor: selected(value) ? palette.olive : palette.transparent,
        borderWidth: 1,
        borderColor: palette.granite,
    }), [selected])

    return(
        <View style={styles.wrapper}>
            { label && <Text style={styles.label}>{ label }</Text> }
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
                { _.map(options, option => (
                    <TouchableOpacity onPress={handleSelect(option.value)} style={itemStyles(option.value)}>
                        <Text style={styles.label}>
                            {option.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    )
}

export default HorizontalOptions