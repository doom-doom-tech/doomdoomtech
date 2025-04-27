import {useMutation, useQueryClient} from "@tanstack/react-query";
import api from "@/common/services/api";
import {NoteIDRequest} from "@/features/note/types/requests";

const deleteNote = async (data: NoteIDRequest) => {
    await api.delete(`/note/${data.noteID}`)
}

const useNoteDelete = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: NoteIDRequest) => deleteNote(data),
        onSuccess: (response, request) => {
            queryClient.invalidateQueries({ queryKey: ['feed'] })
            queryClient.invalidateQueries({ queryKey: ['users'] })
        }
    })
}

export default useNoteDelete