import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
const SvgComponent = (props: SvgProps) => (
	<Svg
		width={24}
		height={24}
		fill="none"
		{...props}
	>
		<Path
			fill="#FAF3EC"
			d="M6.294 17.644 5.25 16.6l9.84-9.85H6.144v-1.5h11.5v11.5h-1.5V7.804l-9.85 9.84Z"
		/>
	</Svg>
)
export default SvgComponent
