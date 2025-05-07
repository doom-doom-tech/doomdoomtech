import {Fragment} from "react";
import {ListRenderItemPropsInterface} from "@/common/components/List";
import {FeedItemEntity} from "@/features/feed/types";
import TrackContextProvider from "@/features/track/context/TrackContextProvider";
import Track from "@/features/track/classes/Track";
import FeedTrack from "@/features/track/components/feed-track/FeedTrack";
import NoteContextProvider from "@/features/note/context/NoteContextProvider";
import Note from "@/features/note/classes/Note";
import FeedNote from "@/features/note/components/feed-note/FeedNote";
import AlbumContextProvider from "@/features/album/context/AlbumContextProvider";
import Album from "@/features/album/classes/Album";
import FeedAlbum from "@/features/album/components/feed-album/FeedAlbum";
import Advertisement from "@/features/advertising/components/advertisement/Advertisement";
import SuggestedUsers from "@/features/user/components/SuggestedUsers";
import VisiblityContextProvider from "@/common/context/VisiblityContextProvider";

interface FeedRenderItemProps extends ListRenderItemPropsInterface<FeedItemEntity> {
    visible: boolean
}

const FeedRenderItem = ({item, index, visible}: FeedRenderItemProps) => {
    switch (item.getType()) {
        case "Track": return (
            <VisiblityContextProvider value={visible}>
                <TrackContextProvider track={item as Track} key={item.getID() + index}>
                    <FeedTrack key={item.getID() + index} />
                </TrackContextProvider>
            </VisiblityContextProvider>

        )

        case "Note": return (
            <NoteContextProvider note={item as Note} key={item.getID() + index}>
                <FeedNote key={item.getID() + index} />
            </NoteContextProvider>
        )

        case "Album": return (
            <AlbumContextProvider album={item as Album} key={item.getID() + index}>
                <FeedAlbum key={item.getID() + index} />
            </AlbumContextProvider>
        )

        case "Advertisement": return (
            <Advertisement key={index} />
        )

        case "SuggestedUsers": return (
            <SuggestedUsers key={index} />
        )

        default: return (
            <Fragment />
        )
    }
}

export default FeedRenderItem