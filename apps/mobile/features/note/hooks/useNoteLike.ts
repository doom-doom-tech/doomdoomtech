import {useMutation} from "@tanstack/react-query";
import {NoteIDRequest} from "@/features/note/types/requests";
import api from "@/common/services/api";

const likeNote = async (data: NoteIDRequest) => {
    await api.post(`/note/${data.noteID}/like`)
}

const useNoteLike = () => useMutation({
    mutationFn: (data: NoteIDRequest) => likeNote(data)
})

export default useNoteLike