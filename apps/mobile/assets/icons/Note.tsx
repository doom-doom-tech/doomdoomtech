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
			d="m13.989 15.175 3.866-10.622a1 1 0 0 1 1.281-.598l.027.01a1 1 0 0 1 .597 1.281l-4.81 13.217c-.488 1.918-2.7 3.264-5.246 3.085-2.791-.194-4.93-2.149-4.775-4.364.155-2.216 2.544-3.853 5.337-3.659 1.526.108 2.855.738 3.723 1.65Zm-4.144 4.367c1.762.123 3.104-.796 3.175-1.792.069-.997-1.132-2.095-2.894-2.219-1.762-.123-3.105.797-3.175 1.794-.07.996 1.132 2.094 2.894 2.217Z"
		/>
	</Svg>
)
export default SvgComponent
