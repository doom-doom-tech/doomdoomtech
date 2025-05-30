import {ActivityIndicator, StyleSheet, TouchableOpacity, View} from 'react-native'
import {Fragment, useEffect, useMemo} from "react";
import {palette, spacing} from "@/theme";
import TrackContextProvider from "@/features/track/context/TrackContextProvider";
import Track from "@/features/track/classes/Track";
import TrackCover from "@/features/track/components/TrackCover";
import TrackInformation from "@/features/track/components/TrackInformation";
import {TypeAnimation} from 'react-native-type-animation';
import useUploadsPending from '@/features/upload/hooks/useUploadsPending';
import {TrackInterface} from '@/features/track/types';
import useGlobalUserContext from '@/features/user/hooks/useGlobalUserContext';
import {UserInterface} from '@/features/user/types';
import Text from '@/common/components/Text';
import {router} from 'expo-router';
import ShrinkDown from "@/common/components/ShrinkDown";
import useUploadRemove from "@/features/upload/hooks/useUploadRemove";
import { useUploadProgressStoreSelectors } from '@/features/upload/store/upload-progress';
import { useQueryClient } from '@tanstack/react-query';

const UploadProgressIndicator = () => {

    const user = useGlobalUserContext()

    const active = useUploadProgressStoreSelectors.active()
    const setUploadProgressState = useUploadProgressStoreSelectors.setState()

    const uploadedTrack = useUploadProgressStoreSelectors.track()

    const latestUploadQuery = useUploadsPending(active)
    const removeUploadMutation = useUploadRemove()

    // Polling logic
    useEffect(() => {
        if (!user || !active) return;

        const interval = setInterval(() => {
            latestUploadQuery.refetch();
        }, 5000);

        return () => clearInterval(interval);
    }, [user, active]);

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
                flexDirection: 'row',
                alignItems: 'center',
                gap: spacing.s,
            },
            progressWrapper: {
                width: '100%',
                height: 10,
                backgroundColor: palette.granite
            }
        })
    }, []);

    const handleDeleteUploadEntry = () => {
        try {
            removeUploadMutation.mutate({
                trackID: latestUploadQuery.data?.trackID
            })

            setUploadProgressState({ active: false })
        } catch (error: any) {
            console.log(error)
        }
    }

    const Content = useMemo(() => {
        switch (latestUploadQuery.data?.status) {
            case 'Completed': return (
                <View style={{ width: '100%' }}>
                    <Text style={{ fontSize: 18, color: palette.offwhite, marginBottom: spacing.s }}>
                        Your track is ready! click here to view it or visit your profile to find it under Latest releases
                    </Text>
                    <ShrinkDown onComplete={handleDeleteUploadEntry} />
                </View>
            )

            default: return (
                <Fragment>
                    <ActivityIndicator />
                    <TypeAnimation
                        sequence={[
                            { text: 'Uploading your files' },
                            { text: 'Checking BPM & Key' },
                            { text: 'Creating your track' },
                            { text: 'Crafting artist profiles' },
                            { text: 'Splitting those royalties' },
                            { text: 'Tapping feet to the beat' },
                            { text: 'Mixing in some magic' },
                            { text: 'Tuning up the vibes' },
                            { text: 'Uploading to the cloud' },
                            { text: 'Dropping the beat' },
                            { text: 'Polishing your masterpiece' },
                            { text: 'Spinning the tracks' },
                            { text: 'Almost a chart-topper!' },
                        ]}
                        loop
                        typeSpeed={25}
                        deletionSpeed={25}
                        delayBetweenSequence={5000}
                        style={{
                            color: 'white'
                        }}
                    />
                </Fragment>
            )
        }
    }, [latestUploadQuery.data])

    const track = new Track(uploadedTrack as TrackInterface)

    const queryClient = useQueryClient()
    queryClient.invalidateQueries({ queryKey: ['uploads', 'pending'] })
    queryClient.refetchQueries({ queryKey: ['uploads', 'pending'] })

    const Wrapper = latestUploadQuery.data?.status === 'Completed' ? TouchableOpacity : View;

    if(!user || !active) return <Fragment />

    return(
        <TrackContextProvider track={track}>
            <Wrapper 
                style={styles.wrapper}
                onPress={() => latestUploadQuery.data?.status === 'Completed' && router.push(`/track/${latestUploadQuery.data.trackID}`)}>
                { track && (
                    <View style={styles.header}>
                        <TrackCover size={50} />
                        <TrackInformation disableRouting />
                    </View>
                )}
                <View style={styles.status}>
                    {Content}
                </View>
            </Wrapper>
        </TrackContextProvider>
    )
}

export default UploadProgressIndicator
