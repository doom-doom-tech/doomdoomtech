import {View} from 'react-native'
import BlockHeader from "@/common/components/block/BlockHeader";
import {ListProps} from "@/common/components/List";
import BlockList from "@/common/components/block/BlockList";
import {spacing, styling} from "@/theme";
import {Fragment, useCallback} from "react";
import {UseInfiniteQueryResult} from "@tanstack/react-query";
import {extractItemsFromInfinityQuery} from "@/common/services/utilities";
import _ from 'lodash';

interface BlockProps<T> extends ListProps<T>{
    title: string
    subtitle: string
    callback: (...args: Array<any>) => unknown
}

const Block = <T extends any>({title, subtitle, callback, ...rest}: BlockProps<T>) => {

    const assertInfiniteQuery = useCallback((query: ListProps<T>['query']): query is UseInfiniteQueryResult<Array<T>> => {
        if(query === undefined) return false
        return 'fetchNextPage' in query
    }, [])


    if(assertInfiniteQuery(rest.query) && (rest.query.isError || _.isEmpty(extractItemsFromInfinityQuery(rest.query.data)))) return <Fragment />
    if(!assertInfiniteQuery(rest.query) && (rest.query!.isError || rest.query!.data === undefined)) return <Fragment />

    return(
        <View style={styling.column.s}>
            <BlockHeader title={title} subtitle={subtitle} callback={callback} />
            <BlockList <T> {...rest} contentContainerStyle={{ alignItems: 'flex-start', gap: spacing.m, paddingLeft: spacing.m }} />
        </View>
    )
}

export default Block