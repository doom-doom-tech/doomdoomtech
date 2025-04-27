import * as React from "react"
import Svg, {Path, SvgProps} from "react-native-svg"

const SvgComponent = (props: SvgProps) => (
	<Svg
		width={24}
		height={24}
		viewBox={"0 0 24 24"}
		fill="none"
		{...props}>
		<Path
			fill="#FAF3EC"
			fillRule="evenodd"
			d="M18 12v1.18A3 3 0 0 1 20 16v2a1 1 0 0 1-1 1h-3.14a4 4 0 0 1-7.72 0H5a1 1 0 0 1-1-1v-2a3 3 0 0 1 2-2.82V10a6 6 0 0 1 5-5.91V3a1 1 0 0 1 2 0v1.09c.088.015.175.032.262.05A2 2 0 0 0 12 6a4 4 0 0 0-4 4v3h8v-1h2Zm-6.993 7.73A2 2 0 0 0 12 20a2 2 0 0 0 1.72-1h-3.44a2 2 0 0 0 .727.73ZM6 17h12v-1a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v1Z"
			clipRule="evenodd"
		/>
	</Svg>
)
export default SvgComponent
