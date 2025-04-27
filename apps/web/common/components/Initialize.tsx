import {StyleSheet, View} from 'react-native'
import {useMemo} from "react";
import {useFonts} from "expo-font";

interface InitializeProps {

}

const Initialize = ({}: InitializeProps) => {

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
        })
    }, []);

    useFonts({ 'Syne': require('@/assets/fonts/SYNE.ttf')});

    return(
        <View style={styles.wrapper}>

        </View>
    )
}

export default Initialize