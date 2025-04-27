import Note from "@/features/note/classes/Note";
import Track from "@/features/track/classes/Track";
import Album from "@/features/album/classes/Album";
import Advertisement from "@/features/advertising/classes/Advertisement";

interface SuggestedUsers {
    getID(): 0
    getType(): "SuggestedUsers"
}

export type FeedItemEntity = Track | Album | Note | Advertisement | SuggestedUsers