import {ReactElement, ReactNode} from "react";

export interface WithChildren {
    children: ReactElement | Array<ReactElement> | ReactNode | Array<ReactNode>
}
