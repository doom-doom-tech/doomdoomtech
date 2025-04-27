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
            d="m12 18.379-6.173 3.245 1.179-6.874L2.01 9.882l6.902-1.003L12 2.624l3.087 6.255 6.902 1.003-4.995 4.868 1.18 6.874L12 18.379Z"
        />
    </Svg>
)
export default SvgComponent
