import {TouchableOpacity, View} from 'react-native'
import {useCallback} from "react";
import Header from "@/common/components/header/Header";
import Brush from '@/assets/icons/Brush';
import {useTopPicksStoreSelectors} from "@/features/list/store/top-picks";
import ActionText from "@/common/components/ActionText";
import useListUpdatePositions from "@/features/list/hooks/useListUpdate";

const TopPicksHeader = () => {

    const state = useTopPicksStoreSelectors.state()
    const setTopPicksState = useTopPicksStoreSelectors.setState()
    const tracks = useTopPicksStoreSelectors.updated()

    const updateListMutation = useListUpdatePositions()

    const handleToggleEditState = useCallback(() => {
        setTopPicksState({ state: 'edit' })
    }, [])

    const handleSave = useCallback(async () => {
        updateListMutation.mutate({ tracks })
        setTopPicksState({ state: 'idle' })
    }, [tracks])

    const RightComponent = useCallback(() => (
        <TouchableOpacity onPress={handleToggleEditState}>
            { state === 'idle' ? <Brush /> : <ActionText callback={handleSave} label={"Save"} /> }
        </TouchableOpacity>
    ), [state])

    return(
        <View style={{ height: 60, width: '100%' }}>
            <Header title={""} RightComponent={RightComponent} />
        </View>
    )
}

export default TopPicksHeader