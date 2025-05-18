import React from 'react';
import {StyleSheet, TouchableOpacity, View, Text} from 'react-native';
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
    truncate?: boolean;
    disableRouting?: boolean;
    selectable?: boolean;
}

const TrackInformation = ({ center, truncate = false, disableRouting = false, selectable = false }: TrackInformationProps) => {
    const track = useTrackContext();

    const styles = StyleSheet.create({
        wrapper: {},
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
        subtitle: {
            fontSize: 12,
            color: palette.granite,
            textAlign: center ? 'center' : 'left',
        },
        artists: {
            flexDirection: 'row',
            gap: 0,
            textAlign: center ? 'center' : 'left',
            justifyContent: center ? 'center' : 'flex-start',
        }
    });

    const artists = useMemo(() => {
        return track.getArtists().map((artist) => artist.getUsername()).join(', ');
    }, [track]);

    const handleRouteTrack = useCallback(async () => {
        if (disableRouting || selectable) return;
        router.canDismiss() && router.dismiss();
        await wait(200);
        router.push(`/track/${track.getID()}`);
    }, [track, disableRouting, selectable]);

    const handleRouteArtist = useCallback((artist: User) => async () => {
        if (disableRouting || selectable) return;
        router.canDismiss() && router.dismiss();
        await wait(200);
        router.push(`/user/${artist.getID()}`);
    }, [disableRouting, selectable]);

    const labelArtists = useMemo(() => track.getArtists().filter(artist => artist.isLabel()), [track]);

    return (
        <View style={styles.wrapper}>
            <TouchableOpacity onPress={handleRouteTrack} disabled={selectable}>
                <Title
                    content={track.getTitle()}
                    center={center}
                    append={<EqualizerAnimation size={18} />}
                    truncate={truncate}
                />
            </TouchableOpacity>

            <View style={styles.artists}>
                {track.getArtists().filter(artist => !artist.isLabel()).map((artist, index) => (
                    <React.Fragment key={artist.getID()}>
                        <Subtitle
                            content={artist.getUsername()}
                            onPress={selectable ? undefined : handleRouteArtist(artist)}
                        />
                        {index !== track.getArtists().filter(artist => !artist.isLabel()).length - 1 && (
                            <Text style={{ color: palette.granite }}>, </Text>
                        )}
                    </React.Fragment>
                ))}
            </View>

            {labelArtists.length > 0 && (
                <View>
                    {labelArtists.map((artist, index) => (
                        <Subtitle
                            onPress={selectable ? undefined : handleRouteArtist(artist)}
                            content={artist.getUsername()}
                            center={center}
                        />
                    ))}
                </View>
            )}
        </View>
    );
};

export default TrackInformation;