import React, {useEffect, useRef, useState} from 'react';
import {Dimensions, Platform, StyleSheet, View} from 'react-native';
import {AppOpenAd, BannerAd, BannerAdSize} from 'react-native-google-mobile-ads';
import AdvertisementHeader from '@/features/advertising/components/advertisement/AdvertisementHeader';

const { width: screenWidth } = Dimensions.get('window');

const adUnitIds = {
    android: 'ca-app-pub-1144049140686008/9445541958',
    ios: 'ca-app-pub-1144049140686008/3187255368',
};

const Advertisement = () => {
    const [adFailed, setAdFailed] = useState(false);
    const bannerRef = useRef<BannerAd>(null);
    const platformAdUnitId = Platform.select(adUnitIds)!;

    // Load App Open Ad on mount
    useEffect(() => {
        const appOpenAd = AppOpenAd.createForAdRequest(platformAdUnitId, {
            keywords: ['music'],
        });

        appOpenAd.load();
    }, [platformAdUnitId]);

    // Retry loading banner ad after failure
    useEffect(() => {
        if (!adFailed) return;

        const timer = setTimeout(() => {
            bannerRef.current?.load();
            setAdFailed(false);
        }, 10000);

        return () => clearTimeout(timer);
    }, [adFailed]);

    if (adFailed) return null;

    return (
        <View style={styles.wrapper}>
            <AdvertisementHeader />
            <BannerAd
                ref={bannerRef}
                unitId={platformAdUnitId}
                size={BannerAdSize.INLINE_ADAPTIVE_BANNER}
                onAdFailedToLoad={() => setAdFailed(true)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        width: screenWidth,
    },
});

export default Advertisement;