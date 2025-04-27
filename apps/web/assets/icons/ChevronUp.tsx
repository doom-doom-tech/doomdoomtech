import * as React from "react"
import Svg, {Path, SvgProps} from "react-native-svg"

const SvgComponent = (props: SvgProps) => (
	<Svg
		xmlns="http://www.w3.org/2000/svg"
		width={24}
		height={24}
		fill="#e8eaed"
		viewBox="0 -960 960 960"
		{...props}
	>
		<Path d="M480-528 296-344l-56-56 240-240 240 240-56 56-184-184Z" />
	</Svg>
)
export default SvgComponent
