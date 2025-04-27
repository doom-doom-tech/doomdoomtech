import {StyleSheet, TouchableOpacity, View} from 'react-native'
import {useCallback, useMemo} from "react";
import Text from "@/common/components/Text";
import {palette, spacing, styling} from "@/theme";
import Magnify from "@/assets/icons/Search"
import Close from "@/assets/icons/Close";

interface SearchHistoryItemProps {
    label: string
    onSelect: (query: string) => void
    onRemove: (query: string) => void
}

const SearchHistoryItem = ({label, onSelect, onRemove}: SearchHistoryItemProps) => {

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                gap: spacing.s,
                padding: spacing.s,
                backgroundColor: palette.grey,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
            },
            label: {
                color: palette.offwhite
            }
        })
    }, []);

    const handleSelect = useCallback(() => {
        onSelect(label)
    }, [label, onSelect])

    const handleRemove = useCallback(() => {
        onRemove(label)
    }, [onRemove])

    return(
        <TouchableOpacity style={styles.wrapper} onPress={handleSelect}>
            <View style={styling.row.s}>
                <Magnify />
                <Text style={styles.label}>
                    {label}
                </Text>
            </View>
            <TouchableOpacity onPress={handleRemove}>
                <Close color={palette.offwhite} />
            </TouchableOpacity>
        </TouchableOpacity>
    )
}

export default SearchHistoryItem