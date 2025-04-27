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
			d="M7 18a.967.967 0 0 1-.713-.288A.968.968 0 0 1 6 17v-2h13V6h2c.283 0 .52.096.712.287.192.192.288.43.288.713v15l-4-4H7Zm-5-1V3c0-.283.096-.52.288-.712A.968.968 0 0 1 3 2h13c.283 0 .52.096.712.288.192.191.288.429.288.712v9c0 .283-.096.52-.288.713A.968.968 0 0 1 16 13H6l-4 4Zm13-6V4H4v7h11Z"
		/>
	</Svg>
)
export default SvgComponent
