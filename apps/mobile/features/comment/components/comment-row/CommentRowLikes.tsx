import {useCallback, useState} from "react";
import IconLabel from "@/common/components/icon/IconLabel";
import FlameFilled from "@/assets/icons/FlameFilled";
import {palette} from "@/theme";
import Flame from "@/assets/icons/Flame";
import {useCommentContext} from "@/features/comment/context/CommentContextProvider";
import useLike from "@/features/like/hooks/useLike";
import useUnlike from "@/features/like/hooks/useUnlike";
import {useAlgoliaEvents} from "@/common/hooks/useAlgoliaEvents";

const CommentRowLikes = () => {

    const comment = useCommentContext()

    const { likeComment } = useAlgoliaEvents()

    const likeMutation = useLike()
    const unlikeMutation = useUnlike()

    const [liked, setLiked] = useState(comment.liked());
    const [likesCount, setLikesCount] = useState(comment.getLikesCount());

    const handleLike = useCallback(() => {

        likeComment(comment.getEntityID())

        setLiked((prevLiked) => {
            const newLiked = !prevLiked;

            newLiked
                ? likeMutation.mutate({
                    entity: 'Comment',
                    entityID: comment.getID() })
                : unlikeMutation.mutate({
                    entity: 'Comment',
                    entityID: comment.getID()
                })

            setLikesCount((prevCount) => (newLiked ? prevCount + 1 : prevCount - 1));
            return newLiked;
        });
    }, [comment]);

    return(
        <IconLabel
            direction={'column'}
            icon={liked ? <FlameFilled color={palette.rose}/> : <Flame color={palette.offwhite}/>}
            label={likesCount}
            callback={handleLike}
        />
    )
}

export default CommentRowLikes