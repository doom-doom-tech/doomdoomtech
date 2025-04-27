import * as React from "react"
import Svg, {Path, SvgProps} from "react-native-svg"

const SvgComponent = (props: SvgProps) => (
	<Svg
		width={24}
		height={24}
		fill="none"
		{...props}
	>
		<Path fill="#FAF3EC" d="M4 20v-8h4v8H4Zm6 0V4h4v16h-4Zm6 0V9h4v11h-4Z" />
	</Svg>
)
export default SvgComponent
