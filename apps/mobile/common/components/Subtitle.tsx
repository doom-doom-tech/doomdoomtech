import {StyleSheet, Text} from 'react-native'
import {useMemo} from "react";
import {palette} from "@/theme";

interface TitleProps {
    center?: boolean
    content: string
}

const Subtitle = ({center, content}: TitleProps) => {

    const styles = useMemo(() => {
        return StyleSheet.create({
            content: {
                fontSize: 12,
                color: palette.granite,
                textAlign: center ? 'center' : 'left'
            },
        })
    }, [center]);

    return(
        <Text style={styles.content}>
            {content}
        </Text>
    )
}

export default Subtitle