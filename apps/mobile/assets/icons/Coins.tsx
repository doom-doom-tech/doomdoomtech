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
            stroke="#FFCE0A"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 8c0-1.657-3.134-3-7-3S7 6.343 7 8m14 0v4c0 1.02-1.186 1.92-3 2.462-1.134.34-2.513.538-4 .538s-2.866-.199-4-.538C8.187 13.92 7 13.02 7 12V8m14 0c0 1.02-1.186 1.92-3 2.462-1.134.34-2.513.538-4 .538s-2.866-.199-4-.538C8.187 9.92 7 9.02 7 8"
        />
        <Path
            stroke="#FFCE0A"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12v4c0 1.02 1.187 1.92 3 2.463C7.134 18.8 8.513 19 10 19s2.866-.198 4-.537c1.813-.543 3-1.443 3-2.463v-1M3 12c0-1.196 1.635-2.23 4-2.71M3 12c0 1.02 1.187 1.92 3 2.463 1.134.339 2.513.537 4 .537.695 0 1.366-.043 2-.124"
        />
    </Svg>
)
export default SvgComponent
