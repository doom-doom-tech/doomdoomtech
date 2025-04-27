import {Dimensions, StyleSheet, View} from 'react-native'
import {useCallback, useMemo} from "react";
import {Image} from "expo-image";
import _ from "lodash";
import {useUploadStoreSelectors} from "@/features/upload/store/upload";
import {useVideoPlayer, VideoView} from "expo-video";

interface UploadFilesPreviewProps {

}

const { width: screenWidth } = Dimensions.get('window')

const UploadFilesPreview = ({}: UploadFilesPreviewProps) => {

    const files = useUploadStoreSelectors.files()
    const preview = useUploadStoreSelectors.preview()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                width: screenWidth,
                height: screenWidth * 0.6,
                justifyContent: 'center',
                alignItems: 'center',
            },
            placeholder: {
                width: screenWidth * 0.6,
                height: screenWidth * 0.6,
                backgroundColor: '#151414',
            },
            preview: {
                width: screenWidth * 0.6,
                height: screenWidth * 0.6,
                objectFit: 'cover',
                borderRadius: 24,
            }
        })
    }, [screenWidth]);



    const Preview = useCallback(() => {
        if(_.isEmpty(files)) {
            return <View style={styles.placeholder} />
        }

        if(_.some(files, file => file.mimeType!.startsWith('video'))) {

            const player = useVideoPlayer(preview ?? '', player => {
                player.staysActiveInBackground = false
                player.allowsExternalPlayback = false
                player.loop = true
                player.muted = true
                player.play();
            });

            return(
                <VideoView
                    player={player}
                    contentFit={'cover'}
                    nativeControls={false}
                    style={styles.preview}
                />
            )
        }

        if(_.some(files, file => file.mimeType!.startsWith('image'))) {
            return(
                <Image
                    alt={"Image"}
                    contentFit={'cover'}
                    source={preview}
                    style={styles.preview}
                />
            )
        }
    }, [files, preview])

    return(
        <View style={styles.wrapper}>
            <Preview />
        </View>
    )
}

export default UploadFilesPreview