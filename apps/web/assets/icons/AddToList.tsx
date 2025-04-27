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
			fill="currentColor"
			d="M3 16v-2h7v2H3Zm0-4v-2h11v2H3Zm0-4V6h11v2H3Zm13 12v-4h-4v-2h4v-4h2v4h4v2h-4v4h-2Z"
		/>
	</Svg>
)
export default SvgComponent
