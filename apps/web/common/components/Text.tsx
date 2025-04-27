import {Text as ReactText, TextProps, TextStyle} from 'react-native'
import _ from "lodash";
import type * as React from "react";
import {palette} from "@/theme";

interface ReactTextProps extends TextProps {
    color?: keyof typeof palette,
    style?: TextStyle
    onPress?: (...args: Array<any>) => unknown
    children: any
}

const Text = ({children, style = {}, color = 'offwhite', onPress = _.noop, ...rest}: ReactTextProps) => {

    const styles: Record<string, TextStyle> = {
        text: {
            fontFamily: 'Syne',
            lineHeight: style.fontSize ? style.fontSize : 16,
            color: palette[color],
        }
    }

    return (
        <ReactText style={[styles.text, style]} {...rest}>
            {children}
        </ReactText>
    )
}

export default Text