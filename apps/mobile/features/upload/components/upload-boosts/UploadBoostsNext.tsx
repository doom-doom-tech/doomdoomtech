import {StyleSheet, View} from 'react-native'
import {useCallback, useMemo} from "react";
import Button from "@/common/components/buttons/Button";
import {router} from "expo-router";

interface UploadBoostsNextProps {

}

const UploadBoostsNext = ({}: UploadBoostsNextProps) => {

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
        })
    }, []);

    const handleNext = useCallback(() => {
        router.push('/upload/complete')
    }, [])

    return(
        <View style={styles.wrapper}>
            <Button fill={'olive'} label={"Next"} callback={handleNext} />
        </View>
    )
}

export default UploadBoostsNext