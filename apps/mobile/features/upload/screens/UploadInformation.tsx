import {ScrollView, StyleSheet, View} from 'react-native'
import {useCallback, useMemo} from "react";
import Header from "@/common/components/header/Header";
import UploadInformationForm from "@/features/upload/components/upload-information/UploadInformationForm";
import {spacing} from "@/theme";
import Button from "@/common/components/buttons/Button";
import {router} from "expo-router";
import {useUploadStoreSelectors} from "@/features/upload/store/upload";
import useGlobalUserContext from "@/features/user/hooks/useGlobalUserContext";

interface UploadInformationProps {

}

const UploadInformation = ({}: UploadInformationProps) => {

    const user = useGlobalUserContext()

    const title = useUploadStoreSelectors.title()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                flex: 1
            },
            content: {
                gap: spacing.m,
                paddingBottom: 200
            }
        })
    }, []);

    const handleNext = useCallback(() => {
        if(user?.isLabel()) return router.push('/upload/genre')
        router.push('/upload/label-tags')
    }, [user])

    const nextVisible = useMemo(() => {
        return Boolean(title)
    }, [title])

    return(
        <View style={styles.wrapper}>
            <Header title={"Track information"} />
            <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps={'handled'}>
                <UploadInformationForm />
                <Button disabled={!nextVisible} fill={'olive'} label={"Next"} callback={handleNext}/>
            </ScrollView>
        </View>
    )
}

export default UploadInformation