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
    // Android safe area simulation (approx 20px) since we don't have edge-to-edge
    const manualSafeArea = isAndroid ? 20 : 0;

    useEffect(() => {
        if (!isNative || !showAd) return;

        const initializeAdMob = async () => {
            try {
                // Request Tracking Authorization (iOS only)
                const { status } = await AdMob.trackingAuthorizationStatus();
                if (status === 'notDetermined') {
                    await AdMob.requestTrackingAuthorization();
                }

                await AdMob.initialize();

                const options = {
                    adId: 'ca-app-pub-4712767609934402/5119071097', // Production ID
                    // adId: 'ca-app-pub-4712767609934402/5119071097', // Production ID
                    adSize: BannerAdSize.SMART_BANNER,
                    position: BannerAdPosition.BOTTOM_CENTER,
                    margin: manualSafeArea,
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
    }, [isNative, showAd, manualSafeArea]);

    if (!isNative || !showAd) return null;

    return (
        <>
            {/* Spacer to prevent content from being hidden behind the fixed banner */}
            <div style={{
                height: adLoaded ? `calc(50px + env(safe-area-inset-bottom) + ${manualSafeArea}px)` : '0px',
                transition: 'height 0.3s'
            }} />

            {/* Fixed Background for AdMob Banner */}
            <div
                className={`fixed bottom-0 left-0 right-0 z-[50] border-t transition-colors duration-300 flex justify-center items-start ${isDarkMode ? 'bg-[#0f172a] border-white/10' : 'bg-white border-gray-200'}`}
                style={{
                    height: adLoaded ? `calc(50px + env(safe-area-inset-bottom) + ${manualSafeArea}px)` : '0px',
                    paddingBottom: `calc(env(safe-area-inset-bottom) + ${manualSafeArea}px)`,
                    transition: 'height 0.3s'
                }}
            />
        </>
    );
};

export default AdMobBanner;
