import {StyleSheet, View} from 'react-native';
import {useCallback, useEffect, useMemo} from "react";
import UserRow from "@/features/user/components/user-row/UserRow";
import _ from 'lodash';
import Input from "@/common/components/inputs/Input";
import HorizontalOptions, {Option} from "@/common/components/HorizontalOptions";
import {palette, spacing} from "@/theme";
import {UploadableArtist, useUploadStoreSelectors} from "@/features/upload/store/upload";
import UserContextProvider from "@/features/user/context/UserContextProvider";

interface UploadRoyaltiesProps {
    artist: UploadableArtist
}

const UploadRoyaltiesBlock = ({ artist }: UploadRoyaltiesProps) => {

    const artists = useUploadStoreSelectors.artists();
    const { setState: setUploadState } = useUploadStoreSelectors.actions();

    // Default labels to label
    useEffect(() => {
        setUploadState({
            artists: _.map(artists, a => {
                if (a.artist.getID() === artist.artist.getID()) {
                    return { ...a, royalties: undefined };
                } else {
                    return a;
                }
            })
        });
    }, []);

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                gap: spacing.m,
                borderBottomWidth: 1,
                padding: spacing.m,
                borderColor: palette.granite,
            },
            label: {
                color: palette.offwhite
            }
        });
    }, []);

    // Explicitly type the options array to match the expected type
    const options = useMemo<Array<Option<"Artist" | "Producer" | "Songwriter">>>(() => {
        return [
            {
                label: 'Artist',
                value: 'Artist' as const
            },
            {
                label: 'Producer',
                value: 'Producer' as const
            },
            {
                label: 'Songwriter',
                value: 'Songwriter' as const
            },
            {
                label: 'Label',
                value: 'Label' as const
            }
        ];
    }, []);

    const handleUpdateArtistRoyalties = useCallback((value: string) => {
        setUploadState({
            artists: _.map(artists, a => {
                if (a.artist.getID() === artist.artist.getID()) {
                    return { ...a, royalties: Number(value) };
                } else {
                    return a;
                }
            })
        });
    }, [artists, artist.artist, setUploadState]);

    const handleSelectArtistRole = useCallback((value: typeof options[number]['value']) => {

        if(artist.artist.isLabel()) return

        setUploadState({
            artists: _.map(artists, a => {
                if (a.artist.getID() === artist.artist.getID()) {
                    return { ...a, role: value };
                } else {
                    return { ...a, role: a.role };
                }
            })
        });
    }, [artists, artist.artist, setUploadState]);

    return (
        <View style={styles.wrapper}>
            <UserContextProvider user={artist.artist}>
                <UserRow type={'no-action'} callback={_.noop} />
            </UserContextProvider>

            <Input
                textContentType={'telephoneNumber'}
                onChangeText={handleUpdateArtistRoyalties}
                placeholder={"Royalty percentage"}
            />

            <View style={{ opacity: artist.artist.isLabel() ? 0.5 : 1 }}>
                <HorizontalOptions
                    label={"Role"}
                    selected={(item) => artist.role === item}
                    onSelect={handleSelectArtistRole}
                    options={options}
                />
            </View>
        </View>
    );
};

export default UploadRoyaltiesBlock;