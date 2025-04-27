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
			d="M13 19V5h6v14h-6Zm-8 0V5h6v14H5Zm10-2h2V7h-2v10Zm-8 0h2V7H7v10Z"
		/>
	</Svg>
)
export default SvgComponent
