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
			fill="#E8EAED"
			d="M16.5 18V6h2v12h-2Zm-11 0V6l9 6-9 6Zm2-3.75L10.9 12 7.5 9.75v4.5Z"
		/>
	</Svg>
)
export default SvgComponent
