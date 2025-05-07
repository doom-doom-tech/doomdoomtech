import {useMutation} from "@tanstack/react-query";
import api from "@/common/services/api";
import _ from "lodash";
import Note from "@/features/note/classes/Note";
import {CreateNoteRequest} from "@/features/note/types/requests";

const createNote = async (data: CreateNoteRequest) => {
    const response = await api.post('/note', data)
    return new Note(_.get(response, 'data.data'))
}

const useNoteCreate = () => useMutation({
    mutationFn: (data: CreateNoteRequest) => createNote(data)
})

export default useNoteCreate