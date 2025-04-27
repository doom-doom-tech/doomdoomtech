import * as React from "react"
import Svg, {G, Mask, Path, SvgProps} from "react-native-svg"

const SvgComponent = (props: SvgProps) => (
	<Svg
		xmlns="http://www.w3.org/2000/svg"
		width={24}
		height={24}
		fill="none"
		{...props}
	>
		<Mask
			id="a"
			width={24}
			height={24}
			x={0}
			y={0}
			maskUnits="userSpaceOnUse"
			style={{
				maskType: "alpha",
			}}
		>
			<Path fill="#D9D9D9" d="M0 0h24v24H0z" />
		</Mask>
		<G mask="url(#a)">
			<Path
				fill="#FAF3EC"
				d="M12 16.73c.229 0 .42-.077.575-.231a.782.782 0 0 0 .233-.576.781.781 0 0 0-.232-.575.782.782 0 0 0-.576-.233.781.781 0 0 0-.575.233.781.781 0 0 0-.233.575c0 .229.078.42.232.576a.781.781 0 0 0 .576.232Zm-.75-3.653h1.5v-6h-1.5v6Zm.75 9.53L8.86 19.5H4.5v-4.36L1.392 12 4.5 8.86V4.5h4.36L12 1.392 15.14 4.5h4.36v4.36L22.608 12 19.5 15.14v4.36h-4.36L12 22.608Zm0-2.107 2.5-2.5H18v-3.5l2.5-2.5L18 9.5V6h-3.5L12 3.5 9.5 6H6v3.5L3.5 12 6 14.5V18h3.5l2.5 2.5Z"
			/>
		</G>
	</Svg>
)
export default SvgComponent
