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
			d="M10 21c-1.1 0-2.042-.392-2.825-1.175C6.392 19.042 6 18.1 6 17s.392-2.042 1.175-2.825C7.958 13.392 8.9 13 10 13c.383 0 .738.046 1.063.137.324.092.637.23.937.413V3h6v4h-4v10c0 1.1-.392 2.042-1.175 2.825C12.042 20.608 11.1 21 10 21Z"
		/>
	</Svg>
)
export default SvgComponent
