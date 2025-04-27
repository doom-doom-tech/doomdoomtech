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
            d="M20 12c0-1.81-3.76-3.985-8.007-4C7.775 7.985 4 10.178 4 12c0 1.825 3.754 4.006 7.997 4C16.252 15.994 20 13.82 20 12Zm-8 6c-5.042.007-10-2.686-10-6s4.984-6.017 10-6c5.016.017 10 2.686 10 6s-4.958 5.993-10 6Zm0-2a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm0-2a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
        />
    </Svg>
)
export default SvgComponent
