import * as React from "react"
import Svg, {G, Mask, Path, SvgProps} from "react-native-svg"

const SvgComponent = (props: SvgProps) => (
    <Svg
        
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
                d="M14.125 16h3.27a.3.3 0 0 0 .22-.086.3.3 0 0 0 .087-.222V7.423a.3.3 0 0 0-.087-.221.3.3 0 0 0-.22-.087h-3.27a.3.3 0 0 0-.221.087.3.3 0 0 0-.087.221v8.27a.3.3 0 0 0 .087.22.3.3 0 0 0 .22.087Zm0 2.115c-.68 0-1.253-.234-1.721-.702-.468-.468-.702-1.041-.702-1.72v-8.27c0-.68.234-1.253.702-1.721.468-.468 1.041-.702 1.72-.702h3.27c.68 0 1.253.234 1.721.702.468.468.702 1.042.702 1.721v8.27c0 .679-.234 1.252-.702 1.72-.468.468-1.041.702-1.72.702h-3.27Zm-6.923 0v-11H5V5h4.317v13.115H7.202Z"
            />
        </G>
    </Svg>
)
export default SvgComponent
