import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useCallback, useMemo} from 'react';
import {useTrackContext} from '@/features/track/context/TrackContextProvider';
import {palette, spacing} from '@/theme';
import Title from '@/common/components/Title';
import EqualizerAnimation from '@/common/components/EqualizerAnimation';
import User from '@/features/user/classes/User';
import {router} from 'expo-router';
import Subtitle from '@/common/components/Subtitle';
import {wait} from '@/common/services/utilities';

interface TrackInformationProps {
    center?: boolean;
    truncate?: boolean; // New prop to control text truncation
}

const TrackInformation = ({ center, truncate = false }: TrackInformationProps) => {
    const track = useTrackContext();

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
            title: {
                position: 'relative',
                justifyContent: center ? 'center' : 'flex-start',
                flexDirection: 'row',
                alignItems: 'center',
                textAlign: 'center',
                gap: spacing.s,
            },
            animation: {
                position: 'absolute',
                right: -24,
            },
            artists: {
                color: palette.granite,
            },
            subtitle: {
                fontSize: 12,
                color: palette.granite,
                textAlign: center ? 'center' : 'left',
            },
        });
    }, []);

    const artists = useMemo(() => {
        return track.getArtists().map((artist) => artist.getUsername()).join(', ');
    }, [track]);

    const handleRouteTrack = useCallback(async () => {
        router.canDismiss() && router.dismiss();
        await wait(200);
        router.push(`/track/${track.getID()}`);
    }, [track]);

    const handleRouteArtist = useCallback(
        (artist: User) => () => {
            router.push(`/user/${artist.getID()}`);
        },
        []
    );

    return (
        <View style={styles.wrapper}>
            <TouchableOpacity onPress={handleRouteTrack}>
                <Title
                    content={track.getTitle()}
                    center={center}
                    append={<EqualizerAnimation size={18} />}
                    truncate={truncate}
                />
            </TouchableOpacity>
            <Subtitle
                content={artists}
                center={center}
                truncate={truncate}
            />
        </View>
    );
};

export default TrackInformation;