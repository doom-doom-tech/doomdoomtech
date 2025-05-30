import {StyleSheet, View} from 'react-native'
import {useMemo} from "react";
import Header from "@/common/components/header/Header";
import UploadCompleteNote from "@/features/upload/components/upload-complete/UploadCompleteNote";
import UploadCompleteInformation from "@/features/upload/components/upload-complete/UploadCompleteInformation";
import UploadCompleteActions from '../components/upload-complete/UploadCompleteActions';
import {spacing} from "@/theme";
import UploadCompletePaymentBanner from "@/features/upload/components/upload-complete/UploadCompletePaymentBanner";
import Scroll from "@/common/components/Scroll";

const UploadComplete = () => {

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                gap: spacing.m
            },
            container: {
                gap: spacing.m,
                paddingBottom: 200
            }
        })
    }, []);

    return(
        <View style={styles.wrapper}>
            <Header title={"Looks good!"} />
            <Scroll contentContainerStyle={styles.container}>
                <UploadCompleteInformation />
                <UploadCompleteNote />
                <UploadCompletePaymentBanner />
                <UploadCompleteActions />
            </Scroll>
        </View>
    )
}

export default UploadComplete