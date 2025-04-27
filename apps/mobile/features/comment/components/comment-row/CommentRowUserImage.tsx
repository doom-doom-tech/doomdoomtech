import {StyleSheet, View} from 'react-native'
import {useMemo} from "react";
import UserCircle from "@/features/user/components/UserCircle";
import {useCommentContext} from "@/features/comment/context/CommentContextProvider";

interface CommentRowUserImageProps {

}

const CommentRowUserImage = ({}: CommentRowUserImageProps) => {

    const comment = useCommentContext()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
        })
    }, []);

    return(
        <View style={styles.wrapper}>
            <UserCircle source={comment.getSender().avatar_url} size={32} />
        </View>
    )
}

export default CommentRowUserImage