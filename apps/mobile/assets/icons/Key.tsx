import * as React from "react"
import Svg, {Path, SvgProps} from "react-native-svg"

const SvgComponent = (props: SvgProps) => (
    <Svg
        width={22}
        height={22}
        fill="none"
        {...props}
    >
        <Path
            fill="#FAF3EC"
            d="m8.612 16.337 3.746-3.747 1.027.183a5 5 0 1 0-4.039-4.039l.184 1.028-6.994 6.994.177 2.651 2.651.177 1.833-1.833-.707-.707a1 1 0 1 1 1.415-1.414l.707.707Zm.707-13.435a7 7 0 1 1 3.715 11.84L6.137 21.64l-4.43-.295a1 1 0 0 1-.932-.932l-.295-4.43 6.898-6.898a6.992 6.992 0 0 1 1.94-6.183h.001Zm4.242 5.656a2 2 0 1 1 2.83-2.828 2 2 0 0 1-2.83 2.828Z"
        />
    </Svg>
)
export default SvgComponent
