import * as React from "react"
import Svg, {Path, SvgProps} from "react-native-svg"

const SvgComponent = (props: SvgProps) => (
    <Svg
        width={24}
        height={24}
        fill="none"
        {...props}>
        <Path fill="#FAF3EC" d="M8 19V5l11 7-11 7Z" />
    </Svg>
)
export default SvgComponent
