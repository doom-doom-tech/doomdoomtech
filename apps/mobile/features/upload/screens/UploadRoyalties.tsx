import {ScrollView, StyleSheet, View} from 'react-native'
import {useCallback, useMemo} from "react";
import Header from "@/common/components/header/Header";
import UploadRoyaltiesBlock from "@/features/upload/components/upload-royalties/UploadRoyaltiesBlock";
import {useUploadStoreSelectors} from "@/features/upload/store/upload";
import _ from "lodash";
import Button from "@/common/components/buttons/Button";
import {router} from "expo-router";
import {spacing} from "@/theme";
import UploadRoyaltiesNotice from "@/features/upload/components/upload-royalties/UploadRoyaltiesNotice";
import UploadDescription from '../components/UploadDescription';

interface UploadRoyaltiesProps {

}

const UploadRoyalties = ({}: UploadRoyaltiesProps) => {

    const artists = useUploadStoreSelectors.artists()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                flex: 1,
                gap: spacing.m
            },
            scrollView: {
                flex: 1
            },
            container: {
                paddingBottom: spacing.m
            },
            bottomContainer: {
                paddingHorizontal: spacing.m,
                paddingBottom: spacing.m
            }
        })
    }, []);

    const handleNext = useCallback(() => {
        router.push('/upload/boosts')
    }, [])

    const nextVisible = useMemo(() => {
        return _.sum(_.map(artists, artist => artist.royalties)) === 100
    }, [artists])

    return(
        <View style={styles.wrapper}>
            <Header title={"Artist royalties"} />
            <UploadDescription description={"Divide royalties among collaborating artists to allocate streaming credits evenly, ensuring the total equals 100%."} />
            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.container} 
                keyboardShouldPersistTaps={'handled'}
            >
                { _.map(artists, artist => (
                    <UploadRoyaltiesBlock artist={artist}  />
                ))}
            </ScrollView>
            <View style={styles.bottomContainer}>
                <Button
                    fill={'olive'}
                    label={"Next"}
                    callback={handleNext}
                    disabled={!nextVisible}
                />
                <UploadRoyaltiesNotice />
            </View>
        </View>
    )
}

export default UploadRoyalties
