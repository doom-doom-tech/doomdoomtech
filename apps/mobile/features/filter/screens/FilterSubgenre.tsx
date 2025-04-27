import {StyleSheet, View} from 'react-native'
import {useCallback, useMemo, useState} from "react";
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
import useSubgenres from "@/features/genre/hooks/useSubgenres";
import Subgenre from "@/features/genre/classes/Subgenre";
import ClearFilterButton from "@/features/filter/components/ClearFilterButton";

interface FilterGenreProps {

}

const FilterGenre = ({}: FilterGenreProps) => {

    const genre = useFilterStoreSelectors.genre()
    const setFilterState = useFilterStoreSelectors.setState()

    const [query, setQuery] = useState<string>('')

    const subgenresQuery = useSubgenres({ query })

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                flex: 1,
                paddingBottom: 100
            },
            label: {
                padding: spacing.m,
                color: palette.offwhite
            },
            search: {
                paddingHorizontal: spacing.m
            },
            content: {
                flex: 1
            }
        })
    }, []);

    const RightComponent = useCallback(() => (
        <ActionText callback={router.back} label={"Save"} />
    ), [])

    const handleSelectGenre = useCallback((genre: Genre) => () => {
        setFilterState({ subgenre: genre })
    }, [])

    const RenderItem = useCallback(({item, index}: ListRenderItemPropsInterface<Subgenre>) => (
        <RadioConsent value={item.getID() === genre?.getID()} callback={handleSelectGenre(item)} key={item.getID()}>
            <Text style={styles.label}>
                {item.getName()}
            </Text>
        </RadioConsent>
    ), [genre, handleSelectGenre])

    return(
        <View style={styles.wrapper}>
            <Header title={"Subgenre"} RightComponent={RightComponent} />
            <Input wrapperStyle={styles.search} placeholder={"Search for a subgenre"} onChangeText={setQuery} />
            <View style={styles.content}>
                <List <Subgenre> renderItem={RenderItem} query={subgenresQuery} />
            </View>
            <ClearFilterButton filter={'subgenre'} />
        </View>
    )
}

export default FilterGenre