import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
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
            d="M18 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm-8.072 3.24a4.02 4.02 0 0 1-.026 1.644l5.04 2.537a4 4 0 1 1-.867 1.803l-5.09-2.562a4 4 0 1 1 .083-5.228l5.036-2.522a4 4 0 1 1 .93 1.772L9.927 11.24ZM6 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm12 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
        />
    </Svg>
)
export default SvgComponent
