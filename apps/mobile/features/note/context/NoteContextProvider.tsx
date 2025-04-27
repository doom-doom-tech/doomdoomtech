import {createContext, useContext} from "react";
import Note from "@/features/note/classes/Note";
import {WithChildren} from "@/common/types/common";

interface NoteContextProps extends WithChildren {
    note: Note;
}

const NoteContext = createContext<Note | null>(null)

const NoteContextProvider = ({note, children}: NoteContextProps) => {
    return (
        <NoteContext.Provider value={note}>
            {children}
        </NoteContext.Provider>
    )
}

export const useNoteContext = () => {
    const Note = useContext(NoteContext)
    if(!Note) throw new Error("NoteContext: No value provided")
    return Note
}

export default NoteContextProvider