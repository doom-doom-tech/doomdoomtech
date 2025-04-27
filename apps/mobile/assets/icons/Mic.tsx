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
            d="M18 14h-4a1 1 0 1 0 0 2h3.659a6.018 6.018 0 0 1-3.686 3.668 2 2 0 1 1-3.945 0A6.018 6.018 0 0 1 6.34 16H10a1 1 0 0 0 0-2H6v-2h4a1 1 0 0 0 0-2H6V8h4a1 1 0 1 0 0-2H6.341A6.002 6.002 0 0 1 17.66 6H14a1 1 0 1 0 0 2h4v2h-4a1 1 0 1 0 0 2h4v2Z"
        />
    </Svg>
)
export default SvgComponent
