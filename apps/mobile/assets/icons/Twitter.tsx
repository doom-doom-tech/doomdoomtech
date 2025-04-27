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
			d="M10.619 14.377 5.237 20.5H3.5l6.437-7.325.27-.309-.25-.326L3.015 3.5H8.08l4.22 5.554.37.487.403-.46L17.977 3.5h1.736l-5.97 6.795-.27.307.247.325 7.272 9.573h-4.917l-4.684-6.097-.37-.483-.402.457Zm5.66 5.1.15.195h2.953l-.61-.802L7.803 4.43l-.15-.198H4.567l.618.804 11.093 14.44Z"
		/>
	</Svg>
)
export default SvgComponent
