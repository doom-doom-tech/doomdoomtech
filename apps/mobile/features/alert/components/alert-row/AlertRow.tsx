import {StyleSheet, useWindowDimensions, View} from 'react-native'
import {useMemo} from "react";
import AlertRowUsers from "@/features/alert/components/alert-row/AlertRowUsers";
import AlertRowText from "@/features/alert/components/alert-row/AlertRowText";
import {palette, spacing} from "@/theme";
import AlertRowEntity from "@/features/alert/components/alert-row/AlertRowEntity";

interface AlertRowProps {

}

const AlertRow = ({}: AlertRowProps) => {

    const { width } = useWindowDimensions()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                height: 80,
                padding: spacing.s,
                flexDirection: 'row',
                justifyContent: 'space-between', alignItems: 'center',
                borderBottomWidth: 1, borderColor: palette.granite
            },
            left: {
                maxWidth: width * 0.7,
                flexDirection: 'row',
                alignItems: 'center',
                gap: spacing.s
            }
        })
    }, []);

    return(
        <View style={styles.wrapper}>
            <View style={styles.left}>
                <AlertRowUsers />
                <AlertRowText />
            </View>
            <AlertRowEntity />
        </View>
    )
}

export default AlertRow