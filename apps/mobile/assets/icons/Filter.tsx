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
            d="m4.08 4 6.482 8.101a2 2 0 0 1 .438 1.25V20l2-1.5v-5.15a2 2 0 0 1 .438-1.249L19.92 4H4.08Zm0-2h15.84a2 2 0 0 1 1.561 3.25L15 13.35v5.15a2 2 0 0 1-.8 1.6l-2 1.5A2 2 0 0 1 9 20v-6.65l-6.481-8.1A2 2 0 0 1 4.08 2Z"
        />
    </Svg>
)
export default SvgComponent
