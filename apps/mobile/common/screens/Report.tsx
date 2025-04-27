import {StyleSheet, View} from 'react-native'
import {useCallback, useState} from "react";
import {router} from "expo-router";
import {formatServerErrorResponse, wait} from "@/common/services/utilities";
import Toast from "react-native-root-toast";
import {TOASTCONFIG} from "@/common/constants";
import useReport from "@/common/hooks/useReport";
import {useReportStoreSelectors} from "@/common/store/report";
import Input from "@/common/components/inputs/Input";
import Header from "@/common/components/header/Header";
import {spacing} from "@/theme";
import Button from "@/common/components/buttons/Button";

interface ReportProps {

}

const Report = ({}: ReportProps) => {

    const entityID = useReportStoreSelectors.entityID()
    const entityType = useReportStoreSelectors.entityType()

    const [content, setContent] = useState<string>('')

    const styles = StyleSheet.create({
        wrapper: {

        },
        content: {
            gap: spacing.m,
            paddingHorizontal: spacing.m
        }
    })

    const reportMutation = useReport()

    const handleSubmit = useCallback(async () => {
        try {
            await reportMutation.mutateAsync({
                content,
                entityID,
                entityType,
            })

            router.back()
            await wait(200)
            Toast.show('Report received', TOASTCONFIG.success)
        } catch (error: any) {
            Toast.show(formatServerErrorResponse(error), TOASTCONFIG.error)
        }
    }, [content, entityID, entityType])

    return(
        <View style={styles.wrapper}>
            <Header title="Report" />
            <View style={styles.content}>
                <Input placeholder={"What's wrong?"} onChangeText={setContent} />
                <Button label={"Submit"} callback={handleSubmit} />
            </View>
        </View>
    )
}

export default Report