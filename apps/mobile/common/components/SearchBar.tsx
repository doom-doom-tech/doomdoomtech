import {StyleSheet, TextInput, TouchableOpacity, View} from 'react-native'
import {useCallback, useMemo, useRef, useState} from "react"
import Input from "@/common/components/inputs/Input"
import useEventListener from "@/common/hooks/useEventListener"
import {useSearchStoreSelectors} from "@/features/search/store/search"
import _ from 'lodash'
import {palette} from "@/theme";
import Close from "@/assets/icons/Close";

interface SearchBarProps {
    placeholder?: string
}

const SearchBar = ({placeholder}: SearchBarProps) => {

    const query = useSearchStoreSelectors.query()
    const setSearchState = useSearchStoreSelectors.setState()
    const inputReference = useRef<TextInput>(null)

    const [value, setValue] = useState<string>('')

    const styles = useMemo(() => StyleSheet.create({
        wrapper: {
            width: '100%',
        },
        clear: {
            position: 'absolute',
            right: 32,
            top: 18
        }
    }), [])

    const debouncedQueryUpdate = useCallback(
        _.debounce((query: string) => {
            setSearchState({ query })
    }, 300), [setSearchState])

    const handleChange = useCallback((query: string) => {
        setValue(query)
        debouncedQueryUpdate(query)
    }, [])

    const handleClear = useCallback(() => {
        setValue('')
        inputReference.current?.blur()
        setSearchState({ query: '' })
    }, [])

    useEventListener('search:focus', () => {
        inputReference.current?.focus()
    })

    return (
        <View style={styles.wrapper}>
            <Input
                value={value}
                ref={inputReference}
                onChangeText={handleChange}
                placeholder={placeholder}
            />
            { Boolean(query) && <TouchableOpacity style={styles.clear} onPress={handleClear}>
                <Close color={palette.offwhite}/>
            </TouchableOpacity>}
        </View>
    )
}

export default SearchBar