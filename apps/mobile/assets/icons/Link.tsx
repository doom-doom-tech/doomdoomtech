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
			stroke="#FAF3EC"
			strokeWidth={0.025}
			d="M10.988 16.988H7c-1.38 0-2.556-.487-3.529-1.46C2.5 14.557 2.013 13.38 2.013 12s.486-2.556 1.458-3.529C4.444 7.5 5.62 7.013 7 7.013h3.988v1.975H7c-.837 0-1.548.292-2.134.878A2.906 2.906 0 0 0 3.988 12c0 .837.292 1.548.878 2.134A2.906 2.906 0 0 0 7 15.012h3.988v1.976Zm-2.976-5.976h7.976v1.976H8.012v-1.976Zm5 5.976v-1.976H17c.837 0 1.548-.293 2.134-.878A2.906 2.906 0 0 0 20.012 12c0-.837-.293-1.548-.878-2.134A2.906 2.906 0 0 0 17 8.988h-3.988V7.013H17c1.38 0 2.556.486 3.529 1.458.972.973 1.459 2.149 1.459 3.529s-.487 2.556-1.46 3.529c-.972.972-2.148 1.459-3.528 1.459h-3.988Z"
		/>
	</Svg>
)
export default SvgComponent
