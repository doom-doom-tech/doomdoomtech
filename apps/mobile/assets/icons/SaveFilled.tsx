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
            d="M8 2h8a3 3 0 0 1 3 3v15a2 2 0 0 1-3.348 1.477l-2.978-2.717a1 1 0 0 0-1.348 0l-2.978 2.717A2 2 0 0 1 5 20V5a3 3 0 0 1 3-3Z"
        />
    </Svg>
)
export default SvgComponent
