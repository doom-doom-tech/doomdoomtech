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
            fill="#E8EAED"
            d="M9 16.5c-.7 0-1.292-.242-1.775-.725C6.742 15.292 6.5 14.7 6.5 14s.242-1.292.725-1.775C7.708 11.742 8.3 11.5 9 11.5s1.292.242 1.775.725c.483.483.725 1.075.725 1.775s-.242 1.292-.725 1.775c-.483.483-1.075.725-1.775.725ZM5 22c-.55 0-1.02-.196-1.413-.587A1.926 1.926 0 0 1 3 20V6c0-.55.196-1.02.587-1.412A1.926 1.926 0 0 1 5 4h1V2h2v2h8V2h2v2h1c.55 0 1.02.196 1.413.588.391.391.587.862.587 1.412v14c0 .55-.196 1.02-.587 1.413A1.926 1.926 0 0 1 19 22H5Zm0-2h14V10H5v10ZM5 8h14V6H5v2Z"
        />
    </Svg>
)
export default SvgComponent
