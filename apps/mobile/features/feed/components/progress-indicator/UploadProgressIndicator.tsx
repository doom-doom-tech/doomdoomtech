import {ActivityIndicator, StyleSheet, View} from 'react-native'
import {Fragment, useMemo} from "react";
import {palette, spacing} from "@/theme";
import Text from "@/common/components/Text";
import TrackContextProvider from "@/features/track/context/TrackContextProvider";
import Track from "@/features/track/classes/Track";
import TrackCover from "@/features/track/components/TrackCover";
import {mockTrackData} from "@/mocks/track";
import TrackInformation from "@/features/track/components/TrackInformation";
import {useUploadProgressStoreSelectors} from "@/features/upload/store/upload-progress";
import {useSocketEvent} from "@/common/context/SocketContextProvider";

const UploadProgressIndicator = () => {

    const active = useUploadProgressStoreSelectors.active()
    const setUploadProgressState = useUploadProgressStoreSelectors.setState()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                gap: spacing.s,
                padding: spacing.m,
                margin: spacing.m,
                borderRadius: 8,
                backgroundColor: palette.teal
            },
            header: {
                gap: spacing.m,
                flexDirection: 'row',
                alignItems: 'center',
            },
            status: {
                color: palette.offwhite,
                fontSize: 18,
            },
            progressWrapper: {
                width: '100%',
                height: 10,
                backgroundColor: palette.granite
            }
        })
    }, []);

    useSocketEvent('track:upload:complete', () => {
        setUploadProgressState({ active: false, track: null })
    })

    if(!active) return <Fragment />

    return(
        <TrackContextProvider track={new Track(mockTrackData)}>
            <View style={styles.wrapper}>
                <View style={styles.header}>
                    <TrackCover size={50} />
                    <TrackInformation />
                </View>
                <Text style={styles.status}>
                    <ActivityIndicator /> Creating your track...
                </Text>
            </View>
        </TrackContextProvider>
    )
}

export default UploadProgressIndicator
