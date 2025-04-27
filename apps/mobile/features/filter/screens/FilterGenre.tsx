import {StyleSheet, View} from 'react-native'
import {useCallback, useMemo, useState} from "react";
import useGenres from "@/features/genre/hooks/useGenres";
import Header from "@/common/components/header/Header";
import Input from "@/common/components/inputs/Input";
import ActionText from "@/common/components/ActionText";
import {router} from "expo-router";
import List, {ListRenderItemPropsInterface} from "@/common/components/List";
import Text from "@/common/components/Text";
import Genre from "@/features/genre/classes/Genre";
import RadioConsent from "@/common/components/consent/RadioConsent";
import {useFilterStoreSelectors} from "@/features/filter/store/filter";
import {palette, spacing} from "@/theme";
import ClearFilterButton from "@/features/filter/components/ClearFilterButton";

interface FilterGenreProps {

}

const FilterGenre = ({}: FilterGenreProps) => {

    const genre = useFilterStoreSelectors.genre()
    const setFilterState = useFilterStoreSelectors.setState()

    const [query, setQuery] = useState<string>('')

    const genresQuery = useGenres({ query })

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
            label: {
                padding: spacing.m,
                color: palette.offwhite
            },
            search: {
                paddingHorizontal: spacing.m
            }
        })
    }, []);

    const RightComponent = useCallback(() => (
        <ActionText callback={router.back} label={"Save"} />
    ), [])

    const handleSelectGenre = useCallback((genre: Genre) => () => {
        setFilterState({ genre: genre })
    }, [])

    const RenderItem = useCallback(({item, index}: ListRenderItemPropsInterface<Genre>) => (
        <RadioConsent value={item.getID() === genre?.getID()} callback={handleSelectGenre(item)} key={item.getID()}>
            <Text style={styles.label}>
                {item.getName()}
            </Text>
        </RadioConsent>
    ), [genre, handleSelectGenre])

    return(
        <View style={styles.wrapper}>
            <Header title={"Genre"} RightComponent={RightComponent} />
            <Input wrapperStyle={styles.search} placeholder={"Search for a genre"} onChangeText={setQuery} />
            <View style={styles.content}>
                <List <Genre> renderItem={RenderItem} query={genresQuery} />
            </View>
            <ClearFilterButton filter={'genre'} />
        </View>
    )
}

export default FilterGenre