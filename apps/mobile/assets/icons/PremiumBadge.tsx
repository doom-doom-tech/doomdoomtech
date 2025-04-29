import * as React from "react"
import Svg, {Circle, Path, SvgProps} from "react-native-svg"

const SvgComponent = (props: SvgProps) => (
    <Svg
        fill="none"
        {...props}
    >
        <Circle cx={33} cy={33} r={33} fill="#A98C1B" />
        <Path
            fill="#fff"
            d="m22.163 43.343-2.298-13.627L28.074 33l4.925-9.851 4.925 9.85 8.21-3.283-2.3 13.627c-.328 1.642-1.641 2.79-3.283 2.79H25.282c-1.477 0-2.955-1.148-3.119-2.79Z"
        />
        <Path
            fill="#fff"
            d="M32.999 26.432a3.284 3.284 0 1 0 0-6.567 3.284 3.284 0 0 0 0 6.567ZM46.133 33a3.284 3.284 0 1 0 0-6.568 3.284 3.284 0 0 0 0 6.568ZM19.865 33a3.284 3.284 0 1 0 0-6.568 3.284 3.284 0 0 0 0 6.568Z"
        />
    </Svg>
)
export default SvgComponent
