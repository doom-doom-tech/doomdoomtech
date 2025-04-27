import {createContext, useContext} from "react";
import Comment from "@/features/comment/classes/Comment"
import {WithChildren} from "@/common/types/common";

interface CommentContextProviderProps extends WithChildren {
    comment: Comment
}

const CommentContext = createContext<Comment>({} as Comment)

const CommentContextProvider = ({comment, children}: CommentContextProviderProps) => {

    return(
        <CommentContext.Provider value={comment}>
            {children}
        </CommentContext.Provider>
    )
}

export const useCommentContext = () => {
    return useContext(CommentContext)
}

export default CommentContextProvider