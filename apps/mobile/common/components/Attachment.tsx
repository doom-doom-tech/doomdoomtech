import {StyleSheet, View} from 'react-native'
import {useMemo} from "react";

interface AttachmentProps {

}

const Attachment = ({}: AttachmentProps) => {

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

export default Attachment