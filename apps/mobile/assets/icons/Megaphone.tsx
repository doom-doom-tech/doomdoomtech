import * as React from "react"
import Svg, {Path, SvgProps} from "react-native-svg"

const SvgComponent = (props: SvgProps) => (
    <Svg
        width={24}
        height={24}
        fill="none"
        {...props}
    >
        <Path
            fill="#000"
            d="M18.3 4.9c-1.1-.8-2.4-1-3.6-.5L6.8 7H6c-1.7 0-3 1.3-3 3v2c0 1.7 1.3 3 3 3h.8l.2.1V17c0 .3.2.6.4.8l3 2c.2.1.4.2.6.2.2 0 .3 0 .5-.1.3-.2.5-.5.5-.9v-2.3l2.7.9c.4.1.9.2 1.3.2.8 0 1.6-.3 2.3-.8 1.1-.8 1.7-1.9 1.7-3.2V8.2c0-1.3-.6-2.5-1.7-3.3ZM5 12v-2c0-.6.4-1 1-1v4c-.6 0-1-.4-1-1Zm5 5.1-1-.7v-.7l1 .3v1.1Zm8-3.3c0 .7-.3 1.2-.8 1.6-.5.4-1.2.5-1.8.3l-4-1.3-3-1-.4-.1V8.7l7.4-2.5c.6-.2 1.3-.1 1.8.3s.8 1 .8 1.6v5.7Z"
        />
    </Svg>
)
export default SvgComponent
