import * as React from "react"
import Svg, {Path, SvgProps} from "react-native-svg"

const SvgComponent = (props: SvgProps) => (
	<Svg
		xmlns="http://www.w3.org/2000/svg"
		width={24}
		height={24}
		fill="none"
		{...props}
	>
		<Path
			fill="#E8EAED"
			d="M9 18c-.55 0-1.02-.196-1.412-.587A1.926 1.926 0 0 1 7 16V4c0-.55.196-1.02.588-1.413A1.926 1.926 0 0 1 9 2h9c.55 0 1.02.196 1.413.587C19.803 2.98 20 3.45 20 4v12c0 .55-.196 1.02-.587 1.413A1.926 1.926 0 0 1 18 18H9Zm0-2h9V4H9v12Zm-4 6c-.55 0-1.02-.196-1.413-.587A1.926 1.926 0 0 1 3 20V6h2v14h11v2H5Z"
		/>
	</Svg>
)
export default SvgComponent
