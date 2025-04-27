import {StyleSheet} from 'react-native'
import Text from "@/common/components/Text";


const Title = ({children}: { children: string }) => {

    const styles = StyleSheet.create({
        text: {
            fontSize: 18,
            fontWeight: 600
        }
    })

    return(
        <Text style={styles.text}>
	        { children }
        </Text>
    )
}

export default Title