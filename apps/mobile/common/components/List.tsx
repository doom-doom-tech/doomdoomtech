import {FlatList, FlatListProps, Text, View, ViewStyle} from "react-native";
import {ReactElement, RefObject, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {InfiniteData, UseInfiniteQueryResult, UseQueryResult} from "@tanstack/react-query";
import {palette, spacing} from "@/theme";
import {extractItemsFromInfinityQuery} from "@/common/services/utilities";
import Animated from 'react-native-reanimated'
import _ from "lodash";
import {RefreshControl} from "react-native-gesture-handler";
import {PaginatedQueryResponse} from "@/common/services/buildPaginatedQuery";

export interface ListProps<T> extends Omit<FlatListProps<T>, 'data'>{
    data?: Array<T>
    reverse?: boolean
    infinite?: boolean
    horizontal?: boolean
    singlePage?: boolean
    disableScroll?: boolean
    disableRefresh?: boolean
    loadingRenderCount?: number
    LoadingComponent?: ReactElement,
    componentRef?: RefObject<FlatList>,
    ListHeaderComponent?: ReactElement
    ListEmptyComponent?: ReactElement
    ListFooterComponent?: ReactElement
    FirstItemPlaceholder?: ReactElement
    autoFetchNextPageEnabled?: boolean
    onRefetch?: (...args: Array<unknown>) => unknown
    onEndReached?: (...args: Array<unknown>) => unknown
    queryFilter?: (items: Array<T>) => Array<T>
    contentContainerStyle?: ViewStyle
    query?: UseQueryResult<Array<T>> | UseInfiniteQueryResult<InfiniteData<PaginatedQueryResponse<T>, unknown>, Error>
    renderItem: ({ item, index }: ListRenderItemPropsInterface<T>) => ReactElement
}

export interface ListRenderItemPropsInterface<T> {
    item: T
    index: number
}

const List = <T,>({
    data,
    query,
    reverse,
    infinite,
    onRefetch,
    renderItem,
    horizontal,
    queryFilter,
    componentRef,
    disableRefresh,
    LoadingComponent,
    loadingRenderCount,
    FirstItemPlaceholder,
    ListHeaderComponent,
    ListEmptyComponent,
    ListFooterComponent,
    contentContainerStyle,
    autoFetchNextPageEnabled = true,
    viewabilityConfig,
    windowSize = 5,
    initialNumToRender = 4,
    maxToRenderPerBatch = 4,
    updateCellsBatchingPeriod = 50,
    onViewableItemsChanged,
    ...rest
}: ListProps<T>) => {

    const [refreshing, setRefreshing] = useState<boolean>(rest.refreshing || false)
    const [hasInitialFetch, setHasInitialFetch] = useState<boolean>(false)
    const prevDataRef = useRef<Array<T> | undefined>()

    // Update internal refreshing state when refreshing prop changes
    useEffect(() => {
        if (rest.refreshing !== undefined) {
            setRefreshing(rest.refreshing)
        }
    }, [rest.refreshing])

    const defaultViewabilityConfig = useMemo(() => ({
        viewAreaCoveragePercentThreshold: 50,
        minimumViewTime: 200,
        waitForInteraction: false
    }), []);

    const handleRefresh = useCallback(async () => {
        setRefreshing(true)
        query && _.isFunction(query.refetch) && await query.refetch()

        onRefetch && onRefetch()
        setTimeout(() => setRefreshing(false), 500)
    }, [onRefetch, query])

    const RefreshControlComponent = useMemo(() => (disableRefresh || !query)
        ? undefined
        : <RefreshControl enabled colors={[palette.rose]} tintColor={palette.rose} onRefresh={handleRefresh} refreshing={refreshing} />
    , [disableRefresh, query, handleRefresh, refreshing])

    const assertInfiniteQuery = useCallback((query: ListProps<T>['query']): query is UseInfiniteQueryResult<Array<T>> => {
        if(query === undefined) return false
        return 'fetchNextPage' in query
    }, [])

    const handleFetchEarlier = useCallback(async () => {
        if(infinite && assertInfiniteQuery(query) && query.hasPreviousPage && !query.isFetchingPreviousPage && autoFetchNextPageEnabled) {
            await query.fetchPreviousPage()
        }
    }, [assertInfiniteQuery, infinite, query])

    const handleFetchNext = useCallback(async () => {
        if(infinite && assertInfiniteQuery(query) && query.hasNextPage && !query.isFetchingNextPage && autoFetchNextPageEnabled) {
            await query.fetchNextPage()
        }
    }, [assertInfiniteQuery, infinite, query])

    const memoizedData: Array<T> = useMemo(() => {
        if(data) return data
        if(!query) return []
        return (infinite && assertInfiniteQuery(query)) ? extractItemsFromInfinityQuery<T>(query.data) : query.data as Array<T>;
    }, [assertInfiniteQuery, infinite, query, reverse, data])

    const filteredData: Array<T> = useMemo(() => {
        return queryFilter ? queryFilter(memoizedData) : memoizedData
    }, [memoizedData, queryFilter])

    useEffect(() => {
        if (query && (query.isSuccess || query.isError) && !hasInitialFetch) {
            setHasInitialFetch(true)
        }
    }, [query, hasInitialFetch])

    useEffect(() => {
        if (!_.isEqual(filteredData, prevDataRef.current)) {
            prevDataRef.current = filteredData
        }
    }, [filteredData])

    const isLoading = useMemo(() => {
        if (!query) return false;
        if (!hasInitialFetch) return true;
        return query.isLoading || (query.isFetching && !_.isEqual(filteredData, prevDataRef.current));
    }, [query, hasInitialFetch, filteredData])

    const RenderItem = ({ item, index }: ListRenderItemPropsInterface<T>) => {
        if(item === null && FirstItemPlaceholder) {
            return FirstItemPlaceholder
        }
        return renderItem({item, index})
    }

    const defaultContainerStyle = {
        gap: spacing.s,
        ...contentContainerStyle,
    }

    if(isLoading) return (
        <View style={{
            ...defaultContainerStyle,
            flexDirection: horizontal ? 'row' : 'column'
        }}>
            { _.map(Array(loadingRenderCount), (_, index) => LoadingComponent)}
        </View>
    )

    if(query && query.isError) return <Text>{'There was a problem loading your items'}</Text>

    return(
        // @ts-ignore
        <Animated.FlatList
            {...rest}
            data={reverse ? _.reverse(filteredData) : filteredData}
            ref={componentRef}
            initialNumToRender={4}
            directionalLockEnabled
            horizontal={horizontal}
            refreshing={refreshing}
            renderItem={RenderItem}
            scrollEventThrottle={16}
            maxToRenderPerBatch={4}
            nestedScrollEnabled={false}
            onEndReached={handleFetchNext}
            onStartReached={handleFetchEarlier}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            ListEmptyComponent={ListEmptyComponent}
            refreshControl={RefreshControlComponent}
            ListHeaderComponent={ListHeaderComponent}
            ListFooterComponent={ListFooterComponent}
            contentContainerStyle={defaultContainerStyle}
            updateCellsBatchingPeriod={updateCellsBatchingPeriod}
            viewabilityConfig={viewabilityConfig || defaultViewabilityConfig}
            onViewableItemsChanged={onViewableItemsChanged}
            maintainVisibleContentPosition={{
                minIndexForVisible: 0,
                autoscrollToTopThreshold: 10,
            }}
        />
    )
}

export default List
