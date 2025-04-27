import {StyleSheet, View} from 'react-native'
import {useMemo} from "react";
import ShareBackground from "@/features/share/components/ShareBackground";
import ShareContent from "@/features/share/components/ShareContent";

interface ShareOverviewProps {

}

const ShareOverview = ({}: ShareOverviewProps) => {

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
        })
    }, []);

    return(
        <View style={styles.wrapper}>
            <ShareBackground />
            <ShareContent />
        </View>
    )
}

export default ShareOverview