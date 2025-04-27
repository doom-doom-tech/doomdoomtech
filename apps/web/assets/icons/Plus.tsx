import * as React from "react"
import Svg, {Path, SvgProps} from "react-native-svg"

const SvgComponent = (props: SvgProps) => (
	<Svg
		width={24}
		height={24}
		fill="#e8eaed"
		viewBox="0 -960 960 960"
		{...props}
	>
		<Path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
	</Svg>
)
export default SvgComponent
