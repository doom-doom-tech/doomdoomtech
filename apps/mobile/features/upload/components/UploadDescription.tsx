import React from 'react';
import {StyleSheet} from 'react-native'
import Text from "@/common/components/Text";
import {palette, spacing} from '@/theme';

interface Props {
    description: string
}

const styles = StyleSheet.create({
    text: {
        fontSize: 16,
        paddingHorizontal: spacing.m,
        color: palette.granite
    }
})

const UploadDescription = ({ description }: Props) => {
    return (
        <Text style={styles.text}>
            {description}
        </Text>
    );
};

export default UploadDescription;