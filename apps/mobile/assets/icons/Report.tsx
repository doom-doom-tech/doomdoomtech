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
			fill="currentColor"
			d="M12 17c.283 0 .52-.096.713-.288A.968.968 0 0 0 13 16a.968.968 0 0 0-.287-.713A.968.968 0 0 0 12 15a.968.968 0 0 0-.713.287A.968.968 0 0 0 11 16c0 .283.096.52.287.712.192.192.43.288.713.288Zm-1-4h2V7h-2v6Zm-2.75 8L3 15.75v-7.5L8.25 3h7.5L21 8.25v7.5L15.75 21h-7.5Zm.85-2h5.8l4.1-4.1V9.1L14.9 5H9.1L5 9.1v5.8L9.1 19Z"
		/>
	</Svg>
)
export default SvgComponent
