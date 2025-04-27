import {StyleSheet, Text as RNText, TextProps as RNTextProps} from 'react-native';
import React, {useMemo} from 'react';

interface TextProps extends RNTextProps {}

const Text: React.FC<TextProps> = ({ style, children, ...rest }) => {
    const textStyle = useMemo(() => [styles.text, style], [style]);

    return (
        <RNText style={textStyle} {...rest}>
            {children}
        </RNText>
    );
};

const styles = StyleSheet.create({
    text: {
        fontFamily: 'Syne',
    },
});

export default Text;