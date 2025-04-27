import * as React from "react"
import Svg, {Path, SvgProps} from "react-native-svg"

const SvgComponent = (props: SvgProps) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
        fill="none"
        {...props}
    >
        <Path
            fill="#FAF3EC"
            d="M4 18.59a1 1 0 1 1-2 0V12.5c0-5.523 4.477-10 10-10s10 4.477 10 10v3.086a1 1 0 0 1-2 0V12.5a8 8 0 0 0-16 0v6.09Zm0-6.09h2a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2Zm0 2v5h2v-5H4Zm14-2h2a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2Zm0 2v5h2v-5h-2Z"
        />
    </Svg>
)
export default SvgComponent
