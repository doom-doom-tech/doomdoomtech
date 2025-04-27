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
			d="M4 11h12.175l-5.6-5.6L12 4l8 8-8 8-1.425-1.4 5.6-5.6H4v-2Z"
		/>
	</Svg>
)
export default SvgComponent
