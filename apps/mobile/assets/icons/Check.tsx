import * as React from "react"
import Svg, {Path, SvgProps} from "react-native-svg"

const SvgComponent = (props: SvgProps) => (
	<Svg
		viewBox="0 0 24 24"
		width={24}
		height={24}
		fill="none"
		{...props}
	>
		<Path
			fill="currentColor"
			d="m9.55 18-5.7-5.7 1.425-1.425L9.55 15.15l9.175-9.175L20.15 7.4 9.55 18Z"
		/>
	</Svg>
)
export default SvgComponent
