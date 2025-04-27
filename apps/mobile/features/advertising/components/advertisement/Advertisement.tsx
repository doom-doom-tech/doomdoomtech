import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Dimensions, Platform, StyleSheet, View} from 'react-native';
import {AppOpenAd, BannerAd, BannerAdSize,} from 'react-native-google-mobile-ads';
import AdvertisementHeader from '@/features/advertising/components/advertisement/AdvertisementHeader';

interface AdvertisementProps {}

const { width: screenWidth } = Dimensions.get('window');

const Advertisement = ({}: AdvertisementProps) => {
    
    const [adFailed, setAdFailed] = useState(false);
    const bannerRef = useRef<BannerAd>(null);


    const advertisementUnitID = useMemo(() => {
        return {
            android: 'ca-app-pub-1144049140686008/9445541958',
            ios: 'ca-app-pub-1144049140686008/3187255368',
        }[Platform.OS as 'ios' | 'android'];
    }, []);

    const appOpenAd = AppOpenAd.createForAdRequest(advertisementUnitID, {
        keywords: ['music'],
    });
    
    const styles = useMemo(
        () =>
            StyleSheet.create({
                wrapper: {
                    width: screenWidth,
                },
            }),
        [],
    );

    // Load App Open Ad
    useEffect(() => {
        appOpenAd.load();
    }, [appOpenAd]);

    // Retry loading banner ad after 1 second if it fails
    useEffect(() => {
        if (adFailed) {
            const timer = setTimeout(() => {
                bannerRef.current?.load();
                setAdFailed(false);
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [adFailed]);

    // If we have a failure, return an empty fragment early
    if (adFailed) {
        return null;
    }

    return (
        <View style={styles.wrapper}>
            <AdvertisementHeader />
            <BannerAd
                ref={bannerRef}
                unitId={advertisementUnitID}
                size={BannerAdSize.INLINE_ADAPTIVE_BANNER}
                onAdFailedToLoad={(err) => {
                    setAdFailed(true);
                }}
            />
        </View>
    );
};

export default Advertisement;