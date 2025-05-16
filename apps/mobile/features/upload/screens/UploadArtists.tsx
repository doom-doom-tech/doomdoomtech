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

const UploadArtists = () => {

    const user = useGlobalUserContext()

    const {width} = useWindowDimensions()

    const artists = useUploadStoreSelectors.artists()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                gap: spacing.m,
            },
        })
    }, []);

    const handleNext = useCallback(() => {
        router.push(artists.length > 1 ? '/upload/royalties' : '/upload/boosts')
    }, [artists])

    const DESCRIPTION = user?.isLabel()
        ? "Select at least one artist for this track. If an artist doesn’t have an account, you can create one here during the upload process."
        : "If you collaborated with other artists on this track, select them here to credit them."

    const [index, setIndex] = useState(0)

    const [routes] = useState([
        {key: 'all', title: 'All'},
        {key: 'following', title: 'Following'},
    ])

    const renderScene = SceneMap({
        all: UploadArtistsList,
        following: UploadArtistCreate,
    })

    return (
        <View style={styles.wrapper}>
            <Header title={"Artists"}/>
            <UploadDescription
                description={DESCRIPTION}/>

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

            <Button fill={'olive'} label={"Next"} callback={handleNext}/>
        </View>
    )
}

export default UploadArtists