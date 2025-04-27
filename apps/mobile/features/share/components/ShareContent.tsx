import {StyleSheet, useWindowDimensions, View} from 'react-native'
import {useMemo} from "react";
import ShareEntity from "@/features/share/components/ShareEntity";
import Header from "@/common/components/header/Header";
import ShareActions from "@/features/share/components/ShareActions";
import {spacing} from "@/theme";

interface ShareContentProps {

}

const ShareContent = ({}: ShareContentProps) => {

    const { width } = useWindowDimensions()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                gap: spacing.m,
            },
        })
    }, []);

    return(
        <View style={styles.wrapper}>
            <Header title={'Share'} />
            <ShareEntity />
            <ShareActions />
        </View>
    )
}

export default ShareContent