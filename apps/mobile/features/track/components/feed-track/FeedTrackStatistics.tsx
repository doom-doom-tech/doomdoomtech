import {StyleSheet, View} from 'react-native'
import {spacing} from "@/theme";
import {ReactElement, useCallback, useMemo, useState} from "react";
import _ from "lodash";
import ChevronRight from "@/assets/icons/ChevronRight";
import {useTrackContext} from "@/features/track/context/TrackContextProvider";
import MainFeedTrackStatistic from "@/features/track/components/feed-track/FeedTrackStatistic";
import track from "@/features/track/classes/Track";

const FeedTrackStatistics = () => {

    const track = useTrackContext()

    const [index, setIndex] = useState<number>(0)

    const styles = StyleSheet.create({
        wrapper :{
            paddingHorizontal: spacing.m,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
        }
    })

    const validStatistics: ReturnType<track['getActivity']> = useMemo(() => {
        return _.reject(track.getActivity(), statistic => statistic.count === 0)
    }, [track])

    const handleLoadNextItem = useCallback(() => {
        if(_.size(validStatistics) === 0 || _.size(validStatistics) === 1 ) return
        setIndex(prevState => {

            if(_.size(validStatistics) === 2) {
                if(prevState + 1 >= _.size(validStatistics)) return 0
                if(prevState + 1 <= _.size(validStatistics)) return prevState + 1
            }

            return prevState === 2 ? 0 : prevState + 1
        })
    }, [index])

    const items: Array<ReactElement> = useMemo(() => _.map(validStatistics, (statistic, __) => (
        <MainFeedTrackStatistic {...statistic} onFling={handleLoadNextItem} key={__} />
    )), [track, handleLoadNextItem, validStatistics])

    return(
        <View style={styles.wrapper}>
            { items[index] }
            {_.size(validStatistics) > 1 && <ChevronRight onPress={handleLoadNextItem} /> }
        </View>
    )
}

export default FeedTrackStatistics