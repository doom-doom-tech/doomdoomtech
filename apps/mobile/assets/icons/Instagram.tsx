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
			d="M20.602 17.06V6.94a3.546 3.546 0 0 0-3.542-3.542H6.94A3.546 3.546 0 0 0 3.398 6.94v10.12a3.546 3.546 0 0 0 3.542 3.542h10.12a3.547 3.547 0 0 0 3.542-3.542ZM12 15.364A3.367 3.367 0 0 0 15.365 12 3.364 3.364 0 1 0 12 15.364ZM6.94 2.5H17.06A4.446 4.446 0 0 1 21.5 6.941V17.06a4.446 4.446 0 0 1-4.441 4.441H6.94A4.446 4.446 0 0 1 2.5 17.059V6.94A4.446 4.446 0 0 1 6.941 2.5Zm2.691 5.956a4.262 4.262 0 1 1 4.737 7.088 4.262 4.262 0 0 1-4.737-7.088Zm6.897-2.055a.771.771 0 1 1 .857 1.283.771.771 0 0 1-.857-1.283Z"
		/>
	</Svg>
)
export default SvgComponent
