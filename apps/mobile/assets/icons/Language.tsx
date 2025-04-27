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
            d="M13.525 16h4.385l-1.993-4.954L13.525 16Zm5.19 2H12.56l-1.658 3.435a1 1 0 0 1-1.802-.87l5.017-10.388a2 2 0 0 1 3.656.123l4.156 10.327a1 1 0 0 1-1.856.746L18.715 18ZM3 2h8a1 1 0 1 1 0 2H3a1 1 0 0 1 0-2Zm0 5a1 1 0 0 1 0-2h7.003a2 2 0 0 1 1.736 2.992c-.945 1.654-1.993 2.844-3.165 3.554-1.472.893-3.32 1.372-5.537 1.453a1 1 0 1 1-.074-1.998c1.898-.07 3.42-.464 4.574-1.165.847-.513 1.676-1.454 2.466-2.836H3Z"
        />
    </Svg>
)
export default SvgComponent
