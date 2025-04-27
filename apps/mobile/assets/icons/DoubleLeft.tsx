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
			fill="#E8EAED"
			d="m11 18-6-6 6-6 1.4 1.4L7.825 12l4.575 4.6L11 18Zm6.6 0-6-6 6-6L19 7.4 14.425 12 19 16.6 17.6 18Z"
		/>
	</Svg>
)
export default SvgComponent
