import {View, ViewabilityConfig, ViewToken} from 'react-native'
import BlockHeader from "@/common/components/block/BlockHeader";
import {ListProps, ListRenderItemPropsInterface} from "@/common/components/List";
import BlockList from "@/common/components/block/BlockList";
import {spacing, styling} from "@/theme";
import {Fragment, useCallback, useRef, useState} from "react";
import {UseInfiniteQueryResult} from "@tanstack/react-query";
import {extractItemsFromInfinityQuery} from "@/common/services/utilities";
import _ from 'lodash';
import VisiblityContextProvider from "@/common/context/VisiblityContextProvider";

interface BlockProps<T> extends ListProps<T>{
    title: string
    subtitle: string
    callback: (...args: Array<any>) => unknown
}

type EntityWithID = {
    getID: () => number
}

const Block = <T extends EntityWithID>({title, subtitle, callback, ...rest}: BlockProps<T>) => {

    const assertInfiniteQuery = useCallback((query: ListProps<T>['query']): query is UseInfiniteQueryResult<Array<T>> => {
        if(query === undefined) return false
        return 'fetchNextPage' in query
    }, [])

    const [visibleIDS, setVisibleIDS] = useState<Set<number>>(new Set())

    const viewabilityConfig: ViewabilityConfig = {
        itemVisiblePercentThreshold: 50,
    }

    const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: Array<ViewToken> }) => {
        const ids = new Set<number>()

        viewableItems.forEach(({ item }) => {
            if (item?.getID) {
                ids.add(item.getID())
            }
        })

        setVisibleIDS(ids)
    }).current

    const RenderItem = ({item, index}: ListRenderItemPropsInterface<T>) => (
        <VisiblityContextProvider value={visibleIDS.has(item.getID())}>
            {rest.renderItem({item, index})}
        </VisiblityContextProvider>
    )

    if (rest.data && _.isEmpty(rest.data))
        return <Fragment />

    if (!rest.data) {
        if (assertInfiniteQuery(rest.query) && (rest.query.isError || _.isEmpty(extractItemsFromInfinityQuery(rest.query.data)))) return <Fragment />
        if (!assertInfiniteQuery(rest.query) && (rest.query!.isError || rest.query!.data === undefined)) return <Fragment />
    }

    return(
        <View style={styling.column.s}>
            <BlockHeader title={title} subtitle={subtitle} callback={callback} />
            <BlockList
                <T>
                {...rest}
                renderItem={RenderItem}
                infinite={rest.data ? false : assertInfiniteQuery(rest.query)}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                contentContainerStyle={{ alignItems: 'flex-start', gap: spacing.m, paddingLeft: spacing.m }}
            />
        </View>
    )
}

export default Block