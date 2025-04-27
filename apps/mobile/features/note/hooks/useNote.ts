import {NoteIDRequest} from "@/features/note/types/requests";
import {useQuery} from "@tanstack/react-query";
import api from "@/common/services/api";
import Note from "@/features/note/classes/Note";
import _ from "lodash";

const fetchNote = async (data: NoteIDRequest) => {
    const response = await api.get(`/note/${data.noteID}`)
    return new Note(_.get(response, 'data.data.note'))
}

const useNote = (data: NoteIDRequest) => useQuery({
    queryKey: ['notes', data.noteID],
    queryFn: () => fetchNote(data)
})

export default useNote