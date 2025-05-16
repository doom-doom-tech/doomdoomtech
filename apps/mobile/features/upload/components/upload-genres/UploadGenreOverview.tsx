import {ScrollView, StyleSheet, useWindowDimensions, View} from 'react-native'
import {Fragment, useCallback, useMemo, useState} from "react";
import useGenres from "@/features/genre/hooks/useGenres";
import List, {ListRenderItemPropsInterface} from "@/common/components/List";
import UploadGenreGroup from "@/features/upload/components/upload-genres/UploadGenreGroup";
import Genre from "@/features/genre/classes/Genre";
import {spacing} from "@/theme";
import Input from "@/common/components/inputs/Input";
import useSubgenres from "@/features/genre/hooks/useSubgenres";
import UploadGenreButton from "@/features/upload/components/upload-genres/UploadGenreButton";
import {SubgenreInterface} from "@/features/genre/types";
import _ from "lodash";

interface UploadGenresProps {

}



const UploadGenreOverview = ({}: UploadGenresProps) => {

    const { height } = useWindowDimensions()

    const [query, setQuery] = useState<string>('')

    const genresQuery = useGenres({ query })
    const searchSubgenreQuery = useSubgenres({query})

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                position: 'relative',
                maxHeight: height - 250
            },
            container: {
                gap: spacing.m,
                paddingTop: spacing.m,
                paddingBottom: 400
            },
            items: {
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: spacing.s
            },
            scrollview: {
                paddingTop: spacing.m,
                paddingBottom: 200,
                minHeight: 600
            }
        })
    }, []);

    const RenderItem = useCallback(({item, index}: ListRenderItemPropsInterface<Genre>) => (
        <UploadGenreGroup genre={item} key={index}/>
    ), [])

    const SearchRenderItem = useCallback(({item, index}: ListRenderItemPropsInterface<SubgenreInterface>) => (
        <View style={styles.items}>
            <UploadGenreButton subgenre={item}/>
        </View>
    ), [])

    const ListView = useCallback(() => {
        if(query) return <Fragment />
        return (
            <List
                <Genre>
                query={genresQuery}
                renderItem={RenderItem}
                contentContainerStyle={styles.container}
            />
        )
    }, [query, genresQuery.data, RenderItem])

    const SearchResults = useCallback(() => {
        if(!query) return <Fragment />
        return (
            <ScrollView contentContainerStyle={styles.scrollview}>
                <View style={styles.items}>
                    { _.map(searchSubgenreQuery.data, subgenre => (
                        <UploadGenreButton subgenre={{ id: subgenre.getID(), name: subgenre.getName(), group: subgenre.getGroup() }} key={subgenre.getID()} />
                    ))}
                </View>
            </ScrollView>
        )
    }, [query, searchSubgenreQuery.data])

    return (
        <View style={styles.wrapper}>
            <Input
                onChangeText={setQuery}
                wrapperStyle={{ paddingHorizontal: spacing.m }}
                placeholder={"Search for a genre"}
            />
            <ListView />
            <SearchResults />
        </View>
    )
}

export default UploadGenreOverview