import React, {useEffect, useState} from 'react';
import {StyleProp} from 'react-native';
import * as FileSystem from 'expo-file-system';
import {SaveFormat, useImageManipulator} from 'expo-image-manipulator';
import * as Crypto from 'expo-crypto';
import {Image, ImageLoadEventData, ImageProps, ImageStyle} from 'expo-image';
import {palette} from "@/theme";
import {CONFIG} from "@/common/constants";

interface CachedResizedImageProps extends ImageProps {
    source: string;
    width: number;
    height?: number;
    style?: StyleProp<ImageStyle>;
}

const CachedImage: React.FC<CachedResizedImageProps> = ({ source, width, height, style, ...rest }) => {

    const [imageUri, setImageUri] = useState<string | null>(null);
    const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
    const context = useImageManipulator(source);

    // Default aspect ratio (1:1) if dimensions can't be fetched
    const DEFAULT_ASPECT_RATIO = 1;

    // Styles for the image
    const styles: ImageStyle = {
        backgroundColor: palette.granite,
        width: width,
        height: height,
        ...(Array.isArray(style) ? Object.assign({}, ...style) : style),
    };

    // Function to download image if source is a remote URL
    const downloadImage = async (uri: string) => {
        const fileUri = `${FileSystem.cacheDirectory}${Date.now()}.jpg`;
        try {
            const downloadResult = await FileSystem.downloadAsync(uri, fileUri);
            const fileInfo = await FileSystem.getInfoAsync(downloadResult.uri);
            if (!fileInfo.exists || fileInfo.size === 0) {
                throw new Error('Downloaded file is invalid or empty');
            }
            return downloadResult.uri;
        } catch (error: any) {
            throw new Error(`Failed to download image: ${error.message}`);
        }
    };

    // Handle an image load to get dimensions
    const handleImageLoad = (event: ImageLoadEventData) => {
        const { width: naturalWidth, height: naturalHeight } = event.source;
        setDimensions({ width: naturalWidth, height: naturalHeight });
    };

    useEffect(() => {
        const resizeAndCacheImage = async () => {
            try {
                // Download image if source is a remote URL
                let processingUri = source;
                if (source.startsWith('http')) {
                    processingUri = await downloadImage(source);
                }

                // If dimensions are not yet available, rely on onLoad for remote images
                if (!dimensions && !source.startsWith('http')) {
                    // For local images, we need dimensions before resizing
                    const fileInfo = await FileSystem.getInfoAsync(processingUri);
                    if (!fileInfo.exists) {
                        throw new Error(`File does not exist: ${processingUri}`);
                    }
                }

                // Generate cache key
                const hash = await Crypto.digestStringAsync(
                    Crypto.CryptoDigestAlgorithm.MD5,
                    `${source}-${width}-${height}`
                );
                const cacheDir = `${FileSystem.cacheDirectory}images/`;
                const filePath = `${cacheDir}${hash}.webp`;

                // Check cache
                const fileInfo = await FileSystem.getInfoAsync(filePath);

                if (fileInfo.exists) {
                    setImageUri(filePath);
                    return;
                }

                // Ensure cache directory exists
                await FileSystem.makeDirectoryAsync(cacheDir, { intermediates: true });

                // Resize image (only specify width to preserve aspect ratio)
                context.reset(); // Reset context to ensure clean state
                context.resize({ width, height });

                const image = await context.renderAsync();
                const resizedImage = await image.saveAsync({
                    format: SaveFormat.WEBP,
                    compress: 0.7,
                });

                // Save to cache
                await FileSystem.moveAsync({
                    from: resizedImage.uri,
                    to: filePath,
                });

                setImageUri(filePath);
            } catch (error) {
                setImageUri(source); // Fallback to original source
            }
        };

        // Only resize if dimensions are available or source is remote (dimensions will come from onLoad)
        if (dimensions || source.startsWith('http')) {
            resizeAndCacheImage();
        }
    }, [source, width, height, dimensions, context]);

    return (
        <Image
            placeholder={{ blurhash: CONFIG.BLURHASH }}
            source={imageUri ? { uri: imageUri } : { uri: source }}
            contentFit={'cover'}
            cachePolicy={'disk'}
            contentPosition={'center'}
            style={styles}
            onLoad={handleImageLoad}
            transition={500}
            enableLiveTextInteraction={false}
            {...rest}
        />
    );
};

export default CachedImage;