import {StyleSheet} from 'react-native'
import {useCommentContext} from "@/features/comment/context/CommentContextProvider";
import {palette} from "@/theme";
import {useMemo} from "react";
import {formatTimePassed} from "@/common/services/utilities";
import Text from "@/common/components/Text";

const styles = StyleSheet.create({
    username: {
        color: palette.offwhite,
        fontWeight: 700
    },
    timestamp: {
        fontSize: 12,
        fontWeight: '200',
        color: palette.granite
    }
})

const CommentRowSender = () => {

    const comment = useCommentContext()

    const timeStamp = useMemo(() => {
        return formatTimePassed(new Date(comment.getTimestamp()).getTime())
    }, [])

    return(
        <Text style={styles.username}>
            {comment.getSender().username} <Text style={styles.timestamp}>{timeStamp}</Text>
        </Text>
    )
}

export default CommentRowSender