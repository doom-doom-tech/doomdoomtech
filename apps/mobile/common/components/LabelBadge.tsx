import {StyleSheet, View} from 'react-native'
import {useMemo} from "react";
import Hashtag from "@/assets/icons/Hashtag";
import {palette} from "@/theme";

interface LabelBadgeProps {
    size?: number
}

const LabelBadge = ({ size = 24 }: LabelBadgeProps) => {

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                backgroundColor: palette.olive,
                borderRadius: size,
                padding: 2,
            },
        })
    }, []);

    return(
        <View style={styles.wrapper}>
            <Hashtag color={palette.offwhite} width={size - 4} height={size -4} />
        </View>
    )
}

export default LabelBadge