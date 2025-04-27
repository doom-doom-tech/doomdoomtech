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
			fill="#FAF3EC"
			d="M5 21c-.55 0-1.02-.196-1.413-.587A1.926 1.926 0 0 1 3 19V5c0-.55.196-1.02.587-1.412A1.926 1.926 0 0 1 5 3h8.925l-2 2H5v14h14v-6.95l2-2V19c0 .55-.196 1.02-.587 1.413A1.926 1.926 0 0 1 19 21H5Zm4-6v-4.25l9.175-9.175c.2-.2.425-.35.675-.45a1.975 1.975 0 0 1 2.175.45L22.425 3c.183.2.325.42.425.663.1.241.15.487.15.737s-.046.496-.137.738a1.874 1.874 0 0 1-.438.662L13.25 15H9Zm2-2h1.4l5.8-5.8-.7-.7-.725-.7L11 11.575V13Z"
		/>
	</Svg>
)
export default SvgComponent
