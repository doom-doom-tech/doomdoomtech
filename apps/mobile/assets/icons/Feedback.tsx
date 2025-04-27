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
			d="M12 15c.283 0 .52-.096.713-.287A.968.968 0 0 0 13 14a.968.968 0 0 0-.287-.713A.968.968 0 0 0 12 13a.968.968 0 0 0-.713.287A.968.968 0 0 0 11 14c0 .283.096.52.287.713.192.191.43.287.713.287Zm-1-4h2V5h-2v6ZM2 22V4c0-.55.196-1.02.587-1.413A1.926 1.926 0 0 1 4 2h16c.55 0 1.02.196 1.413.587C21.803 2.98 22 3.45 22 4v12c0 .55-.196 1.02-.587 1.413A1.926 1.926 0 0 1 20 18H6l-4 4Zm3.15-6H20V4H4v13.125L5.15 16Z"
		/>
	</Svg>
)
export default SvgComponent
