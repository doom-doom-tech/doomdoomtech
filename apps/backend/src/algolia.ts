import {algoliasearch} from 'algoliasearch';
import prisma from "./common/utils/prisma";
import {UserInterface} from "./features/user/types";
import {TrackMapper} from "./features/track/mappers/TrackMapper";
import {TrackInterface} from "./features/track/types";
import {NoteInterface} from "./features/note/types";
import NoteMapper from "./features/note/mappers/NoteMapper";

const client = algoliasearch('RMAD9PJCQN', '16cc8baab62858ef91654fc09f7a6fa6');

const toUnixTimestamp = (date: Date) => Math.floor(date.getTime() / 1000);

// Function to transform Track to Algolia feed item
const transformTrack = (track: TrackInterface) => ({
    objectID: `track-${track.id}`,
    type: 'track',
    created: toUnixTimestamp(new Date(track.created)),
    users: track.artists.map((artist: UserInterface) => artist.id),
    title: track.title,
    userID: track.main_artist,
    genreID: track.genre.id,
    subgenreID: track.subgenre.id,
    total_plays: track.metrics?.total_plays || 0,
    total_likes: track.metrics?.total_likes || 0,
});

// Function to transform Note to Algolia feed item
const transformNote = (note: NoteInterface) => ({
    objectID: `note-${note.id}`,
    type: 'note',
    created: toUnixTimestamp(new Date(note.created)),
    userID: note.user.id,
    users: note.track ? note.track.artists.map((artist: UserInterface) => artist.id) : [],
    content: note.content,
    trackID: note.track ? note.track.id : null,
    likes_count: note.likes_count || 0,
    loops_count: note.loops_count || 0,
});

// Function to fetch and transform all tracks
async function getAllTracks() {
    const tracks = await prisma.track.findMany({
        select: TrackMapper.getSelectableFields()
    });
    return TrackMapper.formatMany(tracks).map(transformTrack);
}

// Function to fetch and transform all notes
async function getAllNotes() {
    const notes = await prisma.note.findMany({
        select: NoteMapper.getSelectableFields()
    });
    return NoteMapper.formatMany(notes).map(transformNote);
}

// Fetch and index objects in Algolia
const processRecords = async () => {
    try {
        console.log('Starting...');

        // Fetch and transform tracks
        const trackItems = await getAllTracks();
        console.log(`Transformed ${trackItems.length} tracks.`);

        // Fetch and transform notes
        const noteItems = await getAllNotes();
        console.log(`Transformed ${noteItems.length} notes.`);

        // Combine track and note items
        const allItems = [...trackItems, ...noteItems];
        console.log(`Total items to index: ${allItems.length}`);

        // Save to Algolia
        return await client.saveObjects({ indexName: 'feed-items', objects: allItems as any });

        console.log('Indexing completed successfully.');
    } catch (error: any) {
        console.log('Error during processing:', error);
    }
};

const addMediaType = async () => {
    const trackItems = await prisma.track.findMany()

    for(let track of trackItems) {
        await client.partialUpdateObject({
            indexName: 'feed-items',
            objectID: `track-${track.id}`,
            attributesToUpdate: {
                media_type: track.video_url ? 'video' : 'audio'
            }
        })
    }
}

addMediaType()