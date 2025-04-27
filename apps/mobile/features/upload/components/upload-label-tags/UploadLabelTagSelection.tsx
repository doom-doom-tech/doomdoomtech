import {StyleSheet, View} from 'react-native'
import {useCallback, useMemo} from "react";
import useLabels from "@/features/label/hooks/useLabels";
import List, {ListRenderItemPropsInterface} from "@/common/components/List";
import User from "@/features/user/classes/User";
import {useUploadStoreSelectors} from "@/features/upload/store/upload";
import _ from "lodash";
import LabelRow from "@/features/user/components/label-row/LabelRow";
import Input from "@/common/components/inputs/Input";
import {spacing} from "@/theme";
import {useUploadSettings, useUploadSettingsStoreSelectors} from "@/features/upload/store/upload-settings";
import {TOASTCONFIG} from "@/common/constants";
import Toast from "react-native-root-toast";
import {extractItemsFromInfinityQuery} from "@/common/services/utilities";
import Subtitle from "@/common/components/Subtitle";
import LabelContextProvider from "@/features/label/context/LabelContextProvider";
import Label from "@/features/label/classes/Label";

interface UploadLabelTagSelectionProps {

}

const UploadLabelTagSelection = ({}: UploadLabelTagSelectionProps) => {

    const labelsQuery = useLabels()

    const tags = useUploadStoreSelectors.tags()
    const { setState: setUploadState } = useUploadStoreSelectors.actions()

    const {labelTagsAmount} = useUploadSettings()
    const setUploadSettingsState = useUploadSettingsStoreSelectors.setState()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                gap: spacing.m
            },
        })
    }, []);

    const handleSelectLabelTag = useCallback((item: User) => () => {
        if(_.some(tags, tag => tag === item.getID())) {
            setUploadSettingsState({ labelTagsAmount: labelTagsAmount + 1 })
            return setUploadState({ tags: _.reject(tags, tag => tag === item.getID()) })
        }

        if(labelTagsAmount === 0) return Toast.show('Sorry that was your last one', TOASTCONFIG.warning)

        setUploadState({ tags: [...tags, item.getID()] })
        setUploadSettingsState({ labelTagsAmount: labelTagsAmount - 1 })
    }, [tags])

    const RenderItem = useCallback(({item, index}: ListRenderItemPropsInterface<Label>) => (
        <LabelContextProvider label={item} key={item.getID()}>
            <LabelRow
                type={'no-action'}
                selectable
                selected={tags.includes(item.getID())}
                callback={handleSelectLabelTag(item)}
            />
        </LabelContextProvider>
    ), [tags])

    if(extractItemsFromInfinityQuery(labelsQuery.data) === []) return (
        <View style={{ paddingHorizontal: spacing.m }}>
            <Subtitle content={"Sorry. There are no labels registered on Doomdoomtech yet"} />
        </View>
    )

    return (
        <View style={styles.wrapper}>
            <Input
                wrapperStyle={{ paddingHorizontal: spacing.m }}
                placeholder={"Search for a label"} />
            <List
                <User>
                infinite
                disableRefresh
                query={labelsQuery}
                renderItem={RenderItem}
                style={styles.wrapper}
            />
        </View>

    )
}

export default UploadLabelTagSelection