import {NoteIDRequest} from "@/features/note/types/requests";
import {useMutation} from "@tanstack/react-query";
import api from "@/common/services/api";
import {DeviceEventEmitter} from "react-native";

const loopNote = async (data: NoteIDRequest): Promise<void> => {
    await api.post(`/note/${data.noteID}/loop`)
}

const useNoteLoop = () => useMutation({
    mutationFn: (data: NoteIDRequest) => loopNote(data),
    onSuccess: (res, req) => {
        DeviceEventEmitter.emit('feed:refetch')
    }
})

export default useNoteLoop