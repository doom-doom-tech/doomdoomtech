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
            stroke="#FAF3EC"
            strokeWidth={2.5}
            d="M2 14.343h20M5.59 2v7.2m3.59-3.6H2m17.436-2.057h-7.18m7.18 4.115s1.538-.002 1.538-2.058-1.538-2.056-1.538-2.056m0 4.113h-7.18M2 20h20"
        />
    </Svg>
)
export default SvgComponent
