import {StyleSheet, useWindowDimensions} from 'react-native'
import {useCallback, useMemo} from "react";
import ImageBanner from "@/common/components/ImageBanner";
import EmptyList from "@/assets/images/empty-list.png"

const CommentsEmpty = () => {

    const { width } = useWindowDimensions()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
        })
    }, []);

    const handleFocusCommentInput = useCallback(() => {

    }, [])

    return(
        <ImageBanner
            size={width}
            source={EmptyList}
            action={''}
            title={'No comments here'}
            subtitle={'Be the first to share your thoughts'}
            callback={handleFocusCommentInput} />
    )
}

export default CommentsEmpty