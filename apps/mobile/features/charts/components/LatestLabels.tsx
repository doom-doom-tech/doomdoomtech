import {StyleSheet, View} from 'react-native'
import {useCallback, useMemo} from "react";
import Block from "@/common/components/block/Block";
import {ListRenderItemPropsInterface} from "@/common/components/List";
import {useFilterStoreSelectors} from "@/features/filter/store/filter";
import useEventListener from "@/common/hooks/useEventListener";
import {router} from "expo-router";
import useLabelsLatest from "@/features/label/hooks/useLabelsLatest";
import LabelContextProvider from "@/features/label/context/LabelContextProvider";
import Label from "@/features/label/classes/Label";
import LabelTile from "@/features/label/components/label-tile/LabelTile";

const LatestLabels = () => {

    const period = useFilterStoreSelectors.period()
    const subgenre = useFilterStoreSelectors.subgenre()
    const genre = useFilterStoreSelectors.genre()
    const tag = useFilterStoreSelectors.label()

    const latestNotesQuery = useLabelsLatest({
        period: period.value, genreID: genre?.getID(), subgenreID: subgenre?.getID(), labelTag: tag
    })

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
        })
    }, []);

    const RenderItem = useCallback(({item, index}: ListRenderItemPropsInterface<Label>) => (
        <LabelContextProvider label={item}>
            <LabelTile />
        </LabelContextProvider>
    ), [])

    const routeAdditionalTracks = useCallback(() => {
        router.push('/list/latestLabels')
    }, [])

    useEventListener('charts:refetch', latestNotesQuery.refetch)

    return(
        <View style={styles.wrapper}>
            <Block
                <Label>
                title={"Latest labels"}
                subtitle={"View all"}
                callback={routeAdditionalTracks}
                query={latestNotesQuery}
                renderItem={RenderItem}
            />
        </View>
    )
}

export default LatestLabels