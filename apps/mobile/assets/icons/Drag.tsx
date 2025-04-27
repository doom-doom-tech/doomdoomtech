import * as React from "react"
import Svg, {Path, SvgProps} from "react-native-svg"

const SvgComponent = (props: SvgProps) => (
    <Svg
        width={24}
        height={24}
        fill="none"
        {...props}
    >
        <Path fill="#E8EAED" d="M4 15v-2h16v2H4Zm0-4V9h16v2H4Z" />
    </Svg>
)
export default SvgComponent
