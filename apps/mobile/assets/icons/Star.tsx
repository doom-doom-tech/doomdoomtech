import * as React from "react"
import Svg, {Path, SvgProps} from "react-native-svg"

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
            d="m12 16.054 3.517 1.85-.672-3.917 2.846-2.774-3.932-.57L12 7.078l-1.759 3.563-3.932.571 2.846 2.774-.672 3.916L12 16.054Zm0 2.26L5.827 21.56l1.179-6.875L2.01 9.817l6.902-1.003L12 2.56l3.087 6.254 6.902 1.003-4.995 4.868 1.18 6.875L12 18.314Z"
        />
    </Svg>
)
export default SvgComponent
