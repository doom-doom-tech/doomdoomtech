import * as React from "react"
import Svg, {Path, SvgProps} from "react-native-svg"

const SvgComponent = (props: SvgProps) => (
	<Svg
		viewBox={"0 0 24 24"}
		width={24}
		height={24}
		fill="none"
		{...props}
	>
		<Path
			fill="#6AD9E0"
			d="m8.6 22.5-1.9-3.2-3.6-.8.35-3.7L1 12l2.45-2.8-.35-3.7 3.6-.8 1.9-3.2L12 2.95l3.4-1.45 1.9 3.2 3.6.8-.35 3.7L23 12l-2.45 2.8.35 3.7-3.6.8-1.9 3.2-3.4-1.45-3.4 1.45Zm.85-2.55 2.55-1.1 2.6 1.1 1.4-2.4 2.75-.65-.25-2.8 1.85-2.1-1.85-2.15.25-2.8-2.75-.6-1.45-2.4L12 5.15l-2.6-1.1L8 6.45l-2.75.6.25 2.8L3.65 12l1.85 2.1-.25 2.85 2.75.6 1.45 2.4Zm1.5-4.4L16.6 9.9l-1.4-1.45-4.25 4.25-2.15-2.1L7.4 12l3.55 3.55Z"
		/>
	</Svg>
)
export default SvgComponent
