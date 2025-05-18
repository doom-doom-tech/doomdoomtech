import {StyleSheet, useWindowDimensions, View} from 'react-native'
import {useCallback, useMemo, useState} from "react";
import Header from "@/common/components/header/Header";
import UploadArtistsList from "@/features/upload/components/upload-artists/UploadArtistsList";
import Button from "@/common/components/buttons/Button";
import {router} from "expo-router";
import {useUploadStoreSelectors} from "@/features/upload/store/upload";
import {palette, spacing} from "@/theme"
import UploadDescription from "@/features/upload/components/UploadDescription";
import useGlobalUserContext from '@/features/user/hooks/useGlobalUserContext';
import {SceneMap, TabBar, TabView} from "react-native-tab-view";
import UploadArtistCreate from "@/features/upload/components/upload-artists/UploadArtistCreate";
import { TOASTCONFIG } from '@/common/constants';
import Toast from 'react-native-root-toast';

const UploadArtists = () => {

    const user = useGlobalUserContext()

    const {width} = useWindowDimensions()

    const artists = useUploadStoreSelectors.artists()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                flex: 1,
                gap: spacing.m,
                marginBottom: spacing.xl,
            },
            tabContainer: {
                flex: 1,
            },
        })
    }, []);

    const handleNext = useCallback(() => {
        if(user?.isLabel() && artists.length === 1) return Toast.show('You must select at least one artist', TOASTCONFIG.error)
        router.push(artists.length > 1 ? '/upload/royalties' : '/upload/boosts')
    }, [artists])

    const DESCRIPTION = user?.isLabel()
        ? "Choose at least one artist who worked on or owns this track. Don’t see them here? You can create a new artist profile"
        : "If you collaborated with other artists on this track, select them here to credit them."

    const [index, setIndex] = useState(0)

    const [routes] = useState([
        {key: 'select', title: 'Select artist(s)'},
        {key: 'create', title: 'Create new artist'},
    ])

    const renderScene = SceneMap({
        select: UploadArtistsList,
        create: UploadArtistCreate,
    })

    return (
        <View style={styles.wrapper}>
            <Header title={`Artists (${artists.filter(artist => !artist.artist.isLabel()).length})`}/>
            <UploadDescription
                description={DESCRIPTION}/>

            <View style={styles.tabContainer}>
                <TabView
                    onIndexChange={setIndex}
                    navigationState={{index, routes}}
                    renderScene={renderScene}
                    renderTabBar={(props) => (
                        <TabBar
                            {...props}
                            indicatorStyle={{
                                backgroundColor: palette.transparent,
                                height: 46,
                                margin: 4,
                                width: width / 2,
                                borderBottomWidth: 2,
                                borderColor: palette.rose
                            }}
                            style={{
                                backgroundColor: palette.transparent,
                                borderRadius: 50,
                                marginBottom: 0,
                                justifyContent: 'center',
                                height: 56,
                                elevation: 0
                            }}
                            activeColor={palette.offwhite}
                            inactiveColor={palette.offwhite + '80'}
                        />
                    )}
                />
            </View>

            <Button fill={'olive'} label={"Next"} callback={handleNext}/>
        </View>
    )
}

export default UploadArtists