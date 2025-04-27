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
			d="M15.49 20.31a1.966 1.966 0 0 1-2.814.182A2.053 2.053 0 0 1 12 18.966V5.034C12 3.911 12.893 3 13.994 3c.573 0 1.118.251 1.496.69l6.012 6.966c.664.768.664 1.92 0 2.688L15.49 20.31ZM13.994 5.034v13.932L20.006 12l-6.012-6.966ZM5.49 20.31a1.966 1.966 0 0 1-2.814.182A2.052 2.052 0 0 1 2 18.966V5.034C2 3.911 2.893 3 3.994 3c.573 0 1.118.251 1.496.69l6.012 6.966c.664.768.664 1.92 0 2.688L5.49 20.31ZM3.994 5.034v13.932L10.006 12 3.994 5.034Z"
		/>
	</Svg>
)
export default SvgComponent
