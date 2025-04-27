import {StyleSheet, View} from 'react-native'
import {useMemo} from "react";
import Text from "@/common/components/Text";
import {palette, spacing} from "@/theme";

interface FAQBlockProps {
    question: string
    answer: string
}

const FAQBlock = ({question, answer}: FAQBlockProps) => {

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                padding: spacing.m,

                borderBottomWidth: 1,
                borderColor: palette.granite
            },
            question: {
                color: palette.offwhite
            },
            answer: {
                color: palette.granite
            }
        })
    }, []);

    return(
        <View style={styles.wrapper}>
            <Text style={styles.question}>
                {question}
            </Text>
            <Text style={styles.answer}>
                {answer}
            </Text>
        </View>
    )
}

export default FAQBlock