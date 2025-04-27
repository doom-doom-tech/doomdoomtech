import {StyleSheet, View} from 'react-native'
import {useMemo} from "react";
import Button, {ButtonProps} from "@/common/components/buttons/Button"
import {palette, spacing} from "@/theme";

interface SheetSubmitProps extends ButtonProps
{}

const SheetSubmit = (props: SheetSubmitProps) => {

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                width: '100%',
                padding: spacing.m,
                backgroundColor: palette.black
            },
        })
    }, []);

    return(
        <View style={styles.wrapper}>
            <Button {...props} />
        </View>
    )
}

export default SheetSubmit