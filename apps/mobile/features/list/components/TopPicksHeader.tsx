import {TouchableOpacity, View} from 'react-native'
import {useCallback} from "react";
import Header from "@/common/components/header/Header";
import Brush from '@/assets/icons/Brush';
import {useTopPicksStoreSelectors} from "@/features/list/store/top-picks";
import ActionText from "@/common/components/ActionText";
import useListUpdatePositions from "@/features/list/hooks/useListUpdate";
import {ImageBackground} from "expo-image";
import ChartsBackground from "@/assets/images/charts.png";
import ChartsHeader from "@/features/charts/components/ChartsHeader";
import ChartsTitle from "@/features/charts/components/ChartsTitle";

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
        <Header title={""} RightComponent={RightComponent} />
    )
}

export default TopPicksHeader