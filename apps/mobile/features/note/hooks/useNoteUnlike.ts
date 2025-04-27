import {useMutation} from "@tanstack/react-query";
import {NoteIDRequest} from "@/features/note/types/requests";
import api from "@/common/services/api";

const unlikeNote = async (data: NoteIDRequest) => {
    await api.post(`/note/${data.noteID}/unlike`)
}

const useNoteUnlike = () => useMutation({
    mutationFn: (data: NoteIDRequest) => unlikeNote(data)
})

export default useNoteUnlike