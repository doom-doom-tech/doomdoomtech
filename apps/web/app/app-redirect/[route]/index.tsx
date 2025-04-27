import {StyleSheet, View} from 'react-native'
import {useMemo} from "react";
import {useFocusEffect, useLocalSearchParams} from "expo-router";

const Index = () => {

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
        })
    }, []);

    const { route } = useLocalSearchParams()

    console.log(route)

    useFocusEffect(() => {
        window.location.href = `doomdoomtech://${route}`
    })

    return(
        <View style={styles.wrapper}>

        </View>
    )
}

export default Index