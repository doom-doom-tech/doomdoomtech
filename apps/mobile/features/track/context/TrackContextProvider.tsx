import {createContext, useContext} from "react";
import Track from "@/features/track/classes/Track";
import {WithChildren} from "@/common/types/common";

interface TrackContextProps extends WithChildren {
    track: Track;
}

const TrackContext = createContext<Track | null>(null)

const TrackContextProvider = ({track, children}: TrackContextProps) => {
    return (
        <TrackContext.Provider value={track}>
            {children}
        </TrackContext.Provider>
    )
}

export const useTrackContext = () => {
    const track = useContext(TrackContext)
    if(!track) throw new Error("TrackContext: No value provided")
    return track
}

export default TrackContextProvider