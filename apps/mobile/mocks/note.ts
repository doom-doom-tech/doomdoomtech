import {NoteInterface} from "@/features/note/types";
import {mockTrackData} from "@/mocks/track";

const mockNoteData = {
    id: 1234,
    content: "This track is absolutely 🔥! The beat switch at 2:30 completely caught me off guard. @producer_name really outdid themselves on this one. #futurebass #electronic",
    userID: 5678,
    trackID: 9012,
    looped: false,
    liked: true,
    looperID: null,
    likes_count: 42,
    loops_count: 15,
    comments_count: 2,
    created: new Date(),
    updated: null,
    deleted: false,
    user: {
        "id": 32,
        "uuid": "39a7494d-39f7-4a2a-8349-5dd34fa1b393",
        "username": "remy",
        "verified": false,
        "following": true,
        "tracks_count": 0,
        "avatar_url": "https://plus.unsplash.com/premium_photo-1689530775582-83b8abdb5020?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cmFuZG9tJTIwcGVyc29ufGVufDB8fDB8fHww"
    },
    looper: null,

    // Related track data
    track: mockTrackData,

    attachments: [
        {
            type: "Image",
            url: "data:image/jpeg;base64,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",
        },
        {
            type: "Image",
            url: "https://i.pinimg.com/originals/e7/9b/da/e79bdafc7294180697e7d4b58d156104.jpg"
        }
    ],

    // Related comments
    comments: [
        {
            id: 456,
            senderID: 7890,
            content: "That beat switch was insane! Been replaying it non-stop 🎧",
            entity: "Note",
            entityID: 1234,
            parentID: null,
            likes: 8,
            created: "2025-01-14T09:15:00.000Z",
            updated: "2025-01-14T09:15:00.000Z",
            "sender": {
                "id": 225,
                "uuid": "e6fca62a-2517-4c2f-a46b-2250e4e532a5",
                "avatar_url" : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoxhWhE-B-k-QyHV4_FSNwV9KX-0ir59AEWQ&s",
                "verified": false,
                "username": "dripd",
                "tracks_count": 6,
                "following": false
            },
            deleted: false
        },
        {
            id: 457,
            senderID: 8901,
            content: "The sound design on this is next level. How did you get that atmospheric pad sound?",
            entity: "Note",
            entityID: 1234,
            parentID: null,
            likes: 5,
            created: "2025-01-14T10:20:00.000Z",
            updated: "2025-01-14T10:20:00.000Z",
            "sender": {
                "id": 225,
                "uuid": "e6fca62a-2517-4c2f-a46b-2250e4e532a5",
                "avatar_url" : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoxhWhE-B-k-QyHV4_FSNwV9KX-0ir59AEWQ&s",
                "verified": false,
                "username": "dripd",
                "tracks_count": 6,
                "following": false
            },
            deleted: false
        }
    ]
} satisfies NoteInterface;

export default mockNoteData;