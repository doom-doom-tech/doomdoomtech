import {ConfigContext, ExpoConfig} from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
    return {
        ...config,
        name: 'doomdoomtech',
        slug: 'doomdoomtech',
        version: '2.0.18',
        orientation: 'portrait',
        icon: './assets/images/icon.png',
        scheme: 'doomdoomtech',
        userInterfaceStyle: 'automatic',
        newArchEnabled: false,
        splash: {
            image: './assets/images/splash.png',
            resizeMode: 'cover',
            backgroundColor: '#252C2D',
        },
        ios: {
            googleServicesFile: process.env.GOOGLE_SERVICES_PLIST ?? './google-services.plist',
            usesAppleSignIn: true,
            supportsTablet: false,
            infoPlist: {
                UIBackgroundModes: ['audio'],
            },
            entitlements: {
                'aps-environment': 'production',
            },
            bundleIdentifier: 'app.doomdoom.tech',
        },
        android: {
            adaptiveIcon: {
                foregroundImage: './assets/images/adaptive-icon.png',
                backgroundColor: '#ffffff',
            },
            versionCode: 218,
            googleServicesFile: process.env.GOOGLE_SERVICES_JSON ?? './google-services.json',
            package: 'app.doomdoom.tech',
            permissions: [
                'com.android.vending.BILLING',
                'android.permission.RECORD_AUDIO',
                'android.permission.MODIFY_AUDIO_SETTINGS',
            ],
        },
        web: {
            bundler: 'metro',
            output: 'static',
            favicon: './assets/images/favicon.png',
        },
        plugins: [
            'expo-router',
            [
                'expo-video',
                {
                    supportsBackgroundPlayback: true,
                    supportsPictureInPicture: true,
                },
            ],
            [
                'expo-build-properties',
                {
                    ios: {
                        useFrameworks: 'static',
                    },
                },
            ],
            [
                'react-native-google-mobile-ads',
                {
                    androidAppId: 'ca-app-pub-1144049140686008~2253947686',
                    iosAppId: 'ca-app-pub-1144049140686008~2441376870',
                },
            ],
            [
                '@react-native-google-signin/google-signin',
                {
                    iosUrlScheme: 'com.googleusercontent.apps.418896855966-548hc0o1evk1ksbboean5dmq0e3unkui',
                },
            ],
            'expo-secure-store',
            'expo-font',
            'expo-audio',
        ],
        extra: {
            router: {
                origin: false,
            },
            eas: {
                projectId: 'fdd82ade-643f-4899-8a37-1e9821d4900c',
            },
        },
        experiments: {
            typedRoutes: true
        },
        owner: 'doomdoom',
        runtimeVersion: '1.0.0',
        updates: {
            url: 'https://u.expo.dev/fdd82ade-643f-4899-8a37-1e9821d4900c',
        },
    };
};