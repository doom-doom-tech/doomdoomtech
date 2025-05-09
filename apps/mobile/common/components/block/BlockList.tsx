import List, {ListProps} from "@/common/components/List";
import {useMemo} from "react";
import {StyleSheet} from "react-native";
import {spacing} from "@/theme";

interface BlockListProps {

}

const BlockList = <T extends any>({...rest}: ListProps<T>) => {

    const styles = useMemo(() => {
        return StyleSheet.create({
            container: {
                gap: spacing.m,
                paddingLeft: spacing.m
            },
        })
    }, []);

    return(
        <List
            <T>
            infinite
            horizontal
            disableRefresh
            directionalLockEnabled
            removeClippedSubviews
            contentContainerStyle={styles.container}
            {...rest}
        />
    )
}

export default BlockList