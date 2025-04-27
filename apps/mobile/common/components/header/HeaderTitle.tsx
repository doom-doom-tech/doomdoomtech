import {StyleSheet, Text} from 'react-native'
import {useMemo} from "react";
import {palette} from "@/theme";

interface HeaderTitleProps {
    title: string
}

const HeaderTitle = ({title}: HeaderTitleProps) => {

    const styles = useMemo(() => {
        return StyleSheet.create({
            text: {
                color: palette.offwhite
            },
        })
    }, []);

    return(
        <Text style={styles.text}>{title}</Text>
    )
}

export default HeaderTitle