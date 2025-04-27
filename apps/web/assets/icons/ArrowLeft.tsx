import * as React from "react"
import Svg, {Path, SvgProps} from "react-native-svg"

const SvgComponent = (props: SvgProps) => (
	<Svg
		width={24}
		height={24}
		viewBox="0 0 24 24"
		fill="none"
		{...props}
	>
		<Path
			fill="#FAF3EC"
			d="M20 13H7.825l5.6 5.6L12 20l-8-8 8-8 1.425 1.4-5.6 5.6H20v2Z"
		/>
	</Svg>
)
export default SvgComponent
