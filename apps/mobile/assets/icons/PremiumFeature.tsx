import * as React from "react"
import Svg, { SvgProps, Circle, Path } from "react-native-svg"
const SvgComponent = (props: SvgProps) => (
    <Svg
        width={24}
        height={24}
        fill="none"
        {...props}
    >
        <Circle cx={12} cy={12} r={12} fill="#A98C1B" />
        <Path
            fill="#fff"
            d="m8.06 15.76-.837-4.954L10.208 12 12 8.418 13.79 12l2.986-1.194-.836 4.955c-.12.597-.597 1.015-1.194 1.015H9.193c-.537 0-1.074-.418-1.134-1.015Z"
        />
        <Path
            fill="#fff"
            d="M12 9.612a1.194 1.194 0 1 0 0-2.388 1.194 1.194 0 0 0 0 2.388ZM16.776 12a1.194 1.194 0 1 0 0-2.388 1.194 1.194 0 0 0 0 2.388ZM7.223 12a1.194 1.194 0 1 0 0-2.388 1.194 1.194 0 0 0 0 2.388Z"
        />
    </Svg>
)
export default SvgComponent
