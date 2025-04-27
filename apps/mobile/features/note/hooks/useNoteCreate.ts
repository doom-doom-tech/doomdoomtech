import {useMutation} from "@tanstack/react-query";
import api from "@/common/services/api";
import _ from "lodash";
import Note from "@/features/note/classes/Note";

const createNote = async (data: FormData) => {
    const response = await api.post('/note', data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
    return new Note(_.get(response, 'data.data'))
}

const useNoteCreate = () => useMutation({
    mutationFn: (data: FormData) => createNote(data)
})

export default useNoteCreate