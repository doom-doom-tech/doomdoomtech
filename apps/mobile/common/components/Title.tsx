import {StyleSheet, Text} from 'react-native'
import {ReactElement, useMemo} from "react";
import {palette} from "@/theme";

interface TitleProps {
    center?: boolean
    content: string
    append?: ReactElement
}

const Title = ({center, content, append}: TitleProps) => {

    const styles = useMemo(() => {
        return StyleSheet.create({
            content: {
                fontSize: 18,
                fontWeight: 600,
                color: palette.offwhite,
                textOverflow: 'ellipses',
                textAlign: center ? 'center' : 'left'
            },
        })
    }, [center]);

    return(
        <Text style={styles.content} ellipsizeMode={'tail'} numberOfLines={1}>
            {content} {!center && append}
        </Text>
    )
}

export default Title