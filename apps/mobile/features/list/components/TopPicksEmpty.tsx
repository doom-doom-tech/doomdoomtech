import {StyleSheet, useWindowDimensions} from 'react-native'
import {useCallback, useMemo} from "react";
import ImageBanner from "@/common/components/ImageBanner";
import Background from "@/assets/mockups/hiphop.png"

const TopPicksEmpty = () => {

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
            source={Background}
            action={''}
            title={'No tracks here'}
            subtitle={'Add tracks to this list and re-order them to create your top picks'}
            callback={handleFocusCommentInput}
        />
    )
}

export default TopPicksEmpty