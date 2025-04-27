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
			d="M19.778 20v-4.571c0-.953-.324-1.762-.972-2.429a3.17 3.17 0 0 0-2.362-1H6.25l4 4.114-1.583 1.6L2 10.857 8.667 4l1.583 1.6-4 4.114h10.194c1.538 0 2.848.557 3.931 1.672C21.458 12.5 22 13.848 22 15.429V20h-2.222Z"
		/>
	</Svg>
)
export default SvgComponent
