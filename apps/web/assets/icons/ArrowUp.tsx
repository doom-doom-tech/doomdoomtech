import * as React from "react"
import Svg, {Path, SvgProps} from "react-native-svg"

const SvgComponent = (props: SvgProps) => (
	<Svg
		width={24}
		height={24}
		viewBox={"0 0 24 24"}
		fill="none"
		{...props}
	>
		<Path
			fill="#FAF3EC"
			d="M11 20V7.825l-5.6 5.6L4 12l8-8 8 8-1.4 1.425-5.6-5.6V20h-2Z"
		/>
	</Svg>
)
export default SvgComponent
