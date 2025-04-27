import * as React from "react"
import Svg, {ClipPath, Defs, G, Path, SvgProps} from "react-native-svg"

const SvgComponent = (props: SvgProps) => (
    <Svg
        width={24}
        height={24}
        fill="none"
        {...props}
    >
        <G fill="#FAF3EC" clipPath="url(#a)">
            <Path d="m19 5.7 2.8-2.8c.2-.2.2-.5 0-.7-.2-.2-.5-.2-.7 0l-3.3 3.3C16.7 5.1 15.4 5 14 5 8.5 5 4 7.2 4 10v9c0 2.8 4.5 5 10 5s10-2.2 10-5v-9c0-1.8-2-3.4-5-4.3ZM6 19v-6c1.8 1.2 4.7 2 8 2 1 0 2.1-.1 3-.2v7c-.9.2-1.9.3-3 .3-5-.1-8-2-8-3.1Zm13-4.7v6.9c-.3.1-.6.2-1 .3v-7c.3 0 .7-.1 1-.2Zm3 4.7c0 .5-.7 1.2-2 1.8V14c.8-.3 1.5-.6 2-1v6Zm-8-6c-5 0-8-1.9-8-3s3-3 8-3c.8 0 1.5.1 2.2.1l-1 1c-.6-.3-1.2-.2-1.7.3-.6.6-.6 1.5 0 2.1.6.6 1.5.6 2.1 0 .5-.5.5-1.1.3-1.7l1.5-1.5c2.9.6 4.6 1.9 4.6 2.7 0 1.1-3 3-8 3ZM10.5 3c.8 0 1.5-.7 1.5-1.5S11.3 0 10.5 0c-.7 0-1.2.4-1.4 1H.5c-.3 0-.5.2-.5.5s.2.5.5.5h8.6c.2.6.7 1 1.4 1Z" />
        </G>
        <Defs>
            <ClipPath id="a">
                <Path fill="#fff" d="M0 0h24v24H0z" />
            </ClipPath>
        </Defs>
    </Svg>
)
export default SvgComponent
