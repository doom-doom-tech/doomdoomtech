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
            d="M12.5 15c.7 0 1.292-.242 1.775-.725.483-.483.725-1.075.725-1.775V7h3V5h-4v5.5a2.372 2.372 0 0 0-1.5-.5c-.7 0-1.292.242-1.775.725C10.242 11.208 10 11.8 10 12.5s.242 1.292.725 1.775c.483.483 1.075.725 1.775.725ZM8 18c-.55 0-1.02-.196-1.412-.587A1.926 1.926 0 0 1 6 16V4c0-.55.196-1.02.588-1.413A1.926 1.926 0 0 1 8 2h12c.55 0 1.02.196 1.413.587C21.803 2.98 22 3.45 22 4v12c0 .55-.196 1.02-.587 1.413A1.926 1.926 0 0 1 20 18H8Zm0-2h12V4H8v12Zm-4 6c-.55 0-1.02-.196-1.413-.587A1.926 1.926 0 0 1 2 20V6h2v14h14v2H4Z"
        />
    </Svg>
)
export default SvgComponent
