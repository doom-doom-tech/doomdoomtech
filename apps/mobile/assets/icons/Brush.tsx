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
            d="m8.538 12.06-1.035 3.207 1.776 1.775 3.165-1.077-3.906-3.906v.001Zm1.24-1.59 4.242 4.243 6.364-6.364a1.999 1.999 0 0 0 0-2.829L18.97 4.106a2.001 2.001 0 0 0-2.829 0L9.778 10.47Zm-3.503 6.4L4.38 18.765l1.653 1.151 1.644-1.644-1.402-1.402Zm14.11-14.178 1.413 1.414a4 4 0 0 1 0 5.657l-7.778 7.778-4.22 1.437-3.536 3.535-4.986-3.473 4.291-4.292L6.95 10.47l7.778-7.778a4 4 0 0 1 5.656 0Z"
        />
    </Svg>
)
export default SvgComponent
