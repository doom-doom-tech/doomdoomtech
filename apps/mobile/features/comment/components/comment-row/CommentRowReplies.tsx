import {StyleSheet, Text, View} from 'react-native'
import {Fragment, useCallback, useMemo} from "react";
import CommentContextProvider, {useCommentContext} from "@/features/comment/context/CommentContextProvider";
import useCommentReplies from "@/features/comment/hooks/useCommentReplies";
import List, {ListRenderItemPropsInterface} from "@/common/components/List";
import Comment from "@/features/comment/classes/Comment"
import CommentRow from "@/features/comment/components/comment-row/CommentRow";
import useEventListener from "@/common/hooks/useEventListener";
import {palette} from "@/theme";

interface CommentRowRepliesProps {

}

const CommentRowReplies = ({}: CommentRowRepliesProps) => {

    const comment = useCommentContext()

    const commentRepliesQuery = useCommentReplies({ commentID: comment.getID() })

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                paddingLeft: 50
            },
            load: {
                fontWeight: 'bold',
                color: palette.granite,
                marginLeft: 16
            }
        })
    }, []);

    const RenderItem = useCallback(({item, index}: ListRenderItemPropsInterface<Comment>) => (
        <CommentContextProvider comment={item}>
            <CommentRow comment={item} />
        </CommentContextProvider>
    ), [])

    const ListFooterComponent = useCallback(() => {
        if(!commentRepliesQuery.hasNextPage) return <Fragment />
        return(
            <Text style={styles.load} onPress={commentRepliesQuery.fetchNextPage}>
                Load more replies
            </Text>
        )
    }, [commentRepliesQuery.hasNextPage])

    useEventListener('replies:refetch', commentRepliesQuery.refetch)

    return(
        <View style={styles.wrapper}>
            <List
                <Comment>
                infinite
                renderItem={RenderItem}
                query={commentRepliesQuery}
                autoFetchNextPageEnabled={false}
                ListFooterComponent={ListFooterComponent} />
        </View>
    )
}

export default CommentRowReplies