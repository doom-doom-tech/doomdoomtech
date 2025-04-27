import {StyleSheet, View} from 'react-native'
import {useCallback, useMemo} from "react";
import Header from "@/common/components/header/Header";
import UploadLabelTagFunds from "@/features/upload/components/upload-label-tags/UploadLabelTagFunds";
import UploadLabelTagSelection from "@/features/upload/components/upload-label-tags/UploadLabelTagSelection";
import {spacing} from "@/theme";
import Button from "@/common/components/buttons/Button";
import {router} from "expo-router";

interface UploadLabelTagsProps {

}

const UploadLabelTags = ({}: UploadLabelTagsProps) => {

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
            content: {
                gap: spacing.m,
            }
        })
    }, []);

    const handleNext = useCallback(() => {
        router.push('/upload/genre')
    }, [])

    return(
        <View style={styles.wrapper}>
            <Header title={"Tag a label"} />
            <View style={styles.content}>
                <UploadLabelTagFunds />
                <UploadLabelTagSelection />
                <Button fill={'olive'} label={"Next"} callback={handleNext}/>
            </View>
        </View>
    )
}

export default UploadLabelTags