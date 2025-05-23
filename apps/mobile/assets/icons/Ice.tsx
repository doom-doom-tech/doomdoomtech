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
			fill="#FAF3EC"
			d="M11 22v-4.15l-3.25 3.2-1.4-1.4L11 15v-2H9l-4.65 4.65-1.4-1.4L6.15 13H2v-2h4.15l-3.2-3.25 1.4-1.4L9 11h2V9L6.35 4.35l1.4-1.4L11 6.15V2h2v4.15l3.25-3.2 1.4 1.4L13 9v2h2l4.65-4.65 1.4 1.4-3.2 3.25H22v2h-4.15l3.2 3.25-1.4 1.4L15 13h-2v2l4.65 4.65-1.4 1.4-3.25-3.2V22h-2Z"
		/>
	</Svg>
)
export default SvgComponent
