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
            d="M20.5 2.095h-17a.5.5 0 0 0-.5.5V5.5a.5.5 0 0 0 .105.305L9.5 14.17v7.055a.5.5 0 0 0 .74.44l4-2.18a.5.5 0 0 0 .26-.44V14.17l6.395-8.365A.5.5 0 0 0 21 5.5V2.595a.5.5 0 0 0-.5-.5Z"
        />
    </Svg>
)
export default SvgComponent
