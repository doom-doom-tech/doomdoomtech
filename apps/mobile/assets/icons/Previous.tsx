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
			d="M8.51 3.69a1.966 1.966 0 0 1 2.814-.182A2.053 2.053 0 0 1 12 5.034v13.932C12 20.089 11.107 21 10.006 21a1.974 1.974 0 0 1-1.496-.69l-6.012-6.966a2.063 2.063 0 0 1 0-2.688L8.51 3.69Zm1.496 15.276V5.034L3.994 12l6.012 6.966ZM18.51 3.69a1.966 1.966 0 0 1 2.814-.182A2.053 2.053 0 0 1 22 5.034v13.932C22 20.089 21.107 21 20.006 21a1.974 1.974 0 0 1-1.496-.69l-6.012-6.966a2.063 2.063 0 0 1 0-2.688L18.51 3.69Zm1.496 15.276V5.034L13.994 12l6.012 6.966Z"
		/>
	</Svg>
)
export default SvgComponent
