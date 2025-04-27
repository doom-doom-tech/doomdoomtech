import {Dimensions, StyleSheet, View} from 'react-native'
import {useCallback, useMemo} from "react";
import {palette} from "@/theme";
import {useCommentContext} from "@/features/comment/context/CommentContextProvider";
import Text from "@/common/components/Text";

interface CommentRowContentProps {

}

const { width: screenWidth } = Dimensions.get("window");


const CommentRowText = ({}: CommentRowContentProps) => {

    const comment = useCommentContext()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
            content: {
                color: palette.offwhite,
                maxWidth: screenWidth - 150
            },
            tag: {
                fontWeight: 'bold',
                color: palette.olive
            }
        })
    }, []);

    const formattedContent = useCallback((content: string) => {
        return content.split(/(\@\w+)/g).map((part, index) =>
            part.startsWith('@') ? (
                <Text key={index} style={styles.tag}>{part}</Text>
            ) : (
                <Text key={index}>{part}</Text>
            )
        );
    }, [])

    return(
        <View style={styles.wrapper}>
            <Text style={styles.content} numberOfLines={0}>
                {formattedContent(comment.getContent())}
            </Text>
        </View>
    )
}

export default CommentRowText