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
            d="m13.774 18 1.176 1.175a1 1 0 0 1-1.414 1.414l-2.829-2.828a1 1 0 0 1 0-1.414l2.829-2.829a1 1 0 1 1 1.414 1.415L13.883 16H16a4 4 0 0 0 0-8 1 1 0 1 1 0-2 6 6 0 1 1 0 12h-2.226ZM10.273 6 9.176 4.902a1 1 0 1 1 1.415-1.415l2.828 2.83a1 1 0 0 1 0 1.413l-2.828 2.828a1 1 0 0 1-1.415-1.414L10.323 8H8a4 4 0 0 0 0 8 1 1 0 1 1 0 2A6 6 0 0 1 8 6h2.273Z"
        />
    </Svg>
)
export default SvgComponent
