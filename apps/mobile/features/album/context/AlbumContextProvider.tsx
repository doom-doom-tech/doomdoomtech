import {createContext, useContext} from "react";
import Album from "@/features/album/classes/Album";
import {WithChildren} from "@/common/types/common";

interface AlbumContextProviderProps extends WithChildren {
    album: Album
}

const AlbumContext = createContext<Album | null>(null)

const AlbumContextProvider = ({album, children}: AlbumContextProviderProps) => {
    return(
        <AlbumContext.Provider value={album} >
            {children}
        </AlbumContext.Provider>
    )
}

export const useAlbumContext = () => {
    const album = useContext(AlbumContext)
    if(!album) throw new Error("AlbumContext: No value provided")
    return album
}

export default AlbumContextProvider