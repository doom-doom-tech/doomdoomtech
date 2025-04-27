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
			d="M2.823 12.573a.25.25 0 0 1 .427.177v3a.25.25 0 0 1-.5 0v-3a.25.25 0 0 1 .073-.177ZM5.073 10.323a.25.25 0 0 1 .427.177v6a.25.25 0 0 1-.5 0v-6a.25.25 0 0 1 .073-.177ZM7.323 9.573a.25.25 0 0 1 .427.177v6.75a.25.25 0 0 1-.5 0V9.75a.25.25 0 0 1 .073-.177ZM9.573 7.323A.25.25 0 0 1 10 7.5v9a.25.25 0 0 1-.5 0v-9a.25.25 0 0 1 .073-.177ZM19.003 11.388l.04.35.34.08a2.5 2.5 0 0 1-.624 4.932H15a.25.25 0 1 1 0-.5h3.75a2 2 0 0 0 0-4 .25.25 0 0 1-.25-.25 5 5 0 0 0-5-5 1.25 1.25 0 0 0-1.25 1.25v8.25a.25.25 0 1 1-.5 0V8.25A1.75 1.75 0 0 1 13.5 6.5h.003a5.5 5.5 0 0 1 5.5 4.888Z"
		/>
	</Svg>
)
export default SvgComponent
