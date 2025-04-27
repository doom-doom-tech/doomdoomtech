import {ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet, View} from 'react-native'
import {Fragment, useCallback, useMemo} from "react";
import List, {ListRenderItemPropsInterface} from "@/common/components/List";
import Comment from "@/features/comment/classes/Comment";
import CommentRow from "@/features/comment/components/comment-row/CommentRow";
import useEventListener from "@/common/hooks/useEventListener";
import {useLocalSearchParams} from "expo-router";
import Header from "@/common/components/header/Header";
import useEntityComments from "@/features/comment/hooks/useEntityComments";
import CommentsEmpty from "@/features/comment/components/CommentsEmpty";
import CommentsInput from "@/features/comment/components/CommentsInput";
import {spacing} from "@/theme";

export const unstable_settings = {
    presentation: "formSheet",
    headerShown: true,
};

interface EntityCommentsProps {

}

const EntityComments = ({}: EntityCommentsProps) => {

    const { entity, entityID } = useLocalSearchParams()

    const commentsQuery = useEntityComments({ entity, entityID })

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                flex: 1,
                paddingBottom: 100
            },
            container: {
                flex: 1
            },
            list: {
                paddingHorizontal: spacing.m
            }
        })
    }, []);

    const RenderItem = useCallback(({item, index}: ListRenderItemPropsInterface<Comment>) => (
        <CommentRow comment={item} key={item.getID()} />
    ), [])

    useEventListener('comments:refetch', commentsQuery.refetch)

    if(commentsQuery.isError) return <Fragment />
    if(commentsQuery.isLoading) return <ActivityIndicator />

    return(
        <View style={styles.wrapper}>
            <Header title={"Comments"} />
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={80}>
                <List
                    <Comment>
                    infinite
                    disableScroll
                    query={commentsQuery}
                    renderItem={RenderItem}
                    keyboardDismissMode={'on-drag'}
                    ListEmptyComponent={CommentsEmpty}
                    contentContainerStyle={styles.list}
                    keyboardShouldPersistTaps={'handled'}
                />
                <CommentsInput entity={entity} entityID={entityID} />
            </KeyboardAvoidingView>
        </View>
    )
}

export default EntityComments