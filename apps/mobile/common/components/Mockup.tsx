import {StyleSheet, View} from 'react-native'
import {useMemo} from "react";

interface MockupProps {

}

const Mockup = ({}: MockupProps) => {

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
        })
    }, []);

    return(
        <View style={styles.wrapper}>

        </View>
    )
}

export default Mockup