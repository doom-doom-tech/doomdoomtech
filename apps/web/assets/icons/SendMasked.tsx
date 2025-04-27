import * as React from "react"
import Svg, {Path, SvgProps} from "react-native-svg"

const SvgComponent = (props: SvgProps) => (
	<Svg
		width={24}
		height={24}
		viewBox={"0 0 24 24"}
		fill="none"
		{...props}
	>
		<Path
			fill="#FAF3EC"
			fillRule="evenodd"
			d="M12.155 5.227 6.34 2.32a3 3 0 0 0-4.08 3.9l2.4 5.37a1.06 1.06 0 0 1 0 .82l-2.4 5.37A3 3 0 0 0 5 22a3.14 3.14 0 0 0 1.35-.32l14-7A3 3 0 0 0 22.002 12H19.994a1 1 0 0 1-.544.89l-14 7a1 1 0 0 1-1.35-1.3l2.39-5.37a2 2 0 0 0 .08-.22h6.89a1 1 0 0 0 1-1H14a2 2 0 0 1-1.732-1H6.57a2 2 0 0 0-.08-.22L4.1 5.41a1 1 0 0 1 1.35-1.3L12 7.385V6c0-.274.055-.535.155-.773Z"
			clipRule="evenodd"
		/>
	</Svg>
)
export default SvgComponent
