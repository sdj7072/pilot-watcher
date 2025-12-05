import { useEffect, useState } from 'react';
import { AdMob, BannerAdSize, BannerAdPosition, BannerAdPluginEvents } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

import { useTheme } from '../context/ThemeContext';

const AdMobBanner = () => {
    const [isNative] = useState(Capacitor.isNativePlatform());
    const [adLoaded, setAdLoaded] = useState(false);
    const { isDarkMode } = useTheme();

    const showAd = import.meta.env.VITE_SHOW_ADMOB !== 'false';

    const isAndroid = Capacitor.getPlatform() === 'android';

    // Android: fixed navigation bar height (approx 48px for gesture nav, or navigation buttons)
    // iOS: uses env(safe-area-inset-bottom) which works correctly
    const androidNavBarHeight = 48;
    const androidAdHeight = 50;

    useEffect(() => {
        if (!isNative || !showAd) return;

        const initializeAdMob = async () => {
            try {
                // Wait for a moment to ensure the app is fully active (fixes ATT popup not showing)
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Request Tracking Authorization (iOS only)
                const { status } = await AdMob.trackingAuthorizationStatus();
                if (status === 'notDetermined') {
                    await AdMob.requestTrackingAuthorization();
                }

                await AdMob.initialize();

                const adId = isAndroid
                    ? 'ca-app-pub-4712767609934402/1003228503' // Android Production ID
                    : 'ca-app-pub-4712767609934402/5119071097'; // iOS Production ID

                const options = {
                    adId: adId,
                    // Use ADAPTIVE_BANNER for Android (centers properly), SMART_BANNER for iOS
                    adSize: isAndroid ? BannerAdSize.ADAPTIVE_BANNER : BannerAdSize.SMART_BANNER,
                    position: BannerAdPosition.BOTTOM_CENTER,
                    margin: isAndroid ? androidNavBarHeight : 0,
                    isTesting: false // Set to true for test ads
                };

                const loadHandle = await AdMob.addListener(BannerAdPluginEvents.Loaded, () => {
                    setAdLoaded(true);
                });

                const failHandle = await AdMob.addListener(BannerAdPluginEvents.FailedToLoad, (error) => {
                    console.error('AdMob Banner Failed to Load:', error);
                });

                await AdMob.showBanner(options);

                return () => {
                    loadHandle.remove();
                    failHandle.remove();
                };
            } catch (error) {
                console.error('AdMob initialization failed:', error);
            }
        };

        initializeAdMob();

        return () => {
            if (isNative) {
                AdMob.removeBanner().catch(console.error);
            }
        };
    }, [isNative, showAd, isAndroid, androidNavBarHeight]);

    if (!isNative || !showAd) return null;

    // Calculate heights differently for Android vs iOS
    // Android: env(safe-area-inset-bottom) = 0, so use fixed values
    // iOS: env(safe-area-inset-bottom) works correctly
    const spacerHeight = isAndroid
        ? `${androidAdHeight + androidNavBarHeight}px`
        : `calc(50px + env(safe-area-inset-bottom))`;

    const backgroundHeight = isAndroid
        ? `${androidAdHeight + androidNavBarHeight}px`
        : `calc(50px + env(safe-area-inset-bottom))`;

    const backgroundPaddingBottom = isAndroid
        ? `${androidNavBarHeight}px`
        : `env(safe-area-inset-bottom)`;

    return (
        <>
            {/* Spacer to prevent content from being hidden behind the fixed banner */}
            <div style={{
                height: adLoaded ? spacerHeight : '0px',
                transition: 'height 0.3s'
            }} />

            {/* Fixed Background for AdMob Banner */}
            <div
                className={`fixed bottom-0 left-0 right-0 z-[50] border-t transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a] border-white/10' : 'bg-white border-gray-200'}`}
                style={{
                    height: adLoaded ? backgroundHeight : '0px',
                    paddingBottom: backgroundPaddingBottom,
                    transition: 'height 0.3s'
                }}
            />
        </>
    );
};

export default AdMobBanner;
