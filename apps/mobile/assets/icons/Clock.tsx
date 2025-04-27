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
            fill="#FAF3EC"
            d="M13 11h4a1 1 0 0 1 0 2h-5a1 1 0 0 1-1-1V6a1 1 0 0 1 2 0v5Zm-1 11C6.477 22 2 17.522 2 12 2 6.475 6.477 2 12 2s10 4.476 10 10c0 5.523-4.477 10-10 10Zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"
        />
    </Svg>
)
export default SvgComponent
