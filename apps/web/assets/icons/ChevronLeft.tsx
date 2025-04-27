import * as React from "react"
import Svg, {Path, SvgProps} from "react-native-svg"

const SvgComponent = (props: SvgProps) => (
	<Svg
		width={24}
		height={24}
		fill="none"
		{...props}
	>
		<Path
			fill="#FAF3EC"
			d="m8.3 11.675 6-6 1.4 1.4-4.6 4.6 4.6 4.6-1.4 1.4-6-6Z"
		/>
	</Svg>
)
export default SvgComponent
