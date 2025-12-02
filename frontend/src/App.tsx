import { useState, useEffect, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import Header from './components/Header';
import AdMobBanner from './components/AdMobBanner';
import PilotDuty from './components/PilotDuty';
import FilterBar from './components/FilterBar';
import ShipList from './components/ShipList';
import ErrorState from './components/ErrorState';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { FilterType } from './types';
import { usePilotData } from './hooks/usePilotData';
import { useShipFilter } from './hooks/useShipFilter';
import { Toaster, toast } from 'sonner';
import { StatusBar } from '@capacitor/status-bar';


import SettingsModal from './components/SettingsModal';

function AppContent() {
    const { data: fetchedData, isLoading, isError, mutate, isValidating } = usePilotData();

    // derived state instead of synced state
    const displayedData = fetchedData || null;

    const { searchTerm, setSearchTerm, statusFilter, setStatusFilter, filteredShips } = useShipFilter(displayedData?.ships);

    // SWR handles auto-refresh, but we still need a countdown timer for UI
    const [timeLeft, setTimeLeft] = useState(60);
    const [isCoolingDown, setIsCoolingDown] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    // Reset timer when validation finishes (fix for bug #3)
    useEffect(() => {
        if (!isValidating && !isCoolingDown) {
            // Use a timeout to avoid synchronous state update during render phase if this effect runs immediately
            const timeoutId = setTimeout(() => setTimeLeft(60), 0);
            return () => clearTimeout(timeoutId);
        }
    }, [isValidating, isCoolingDown]);

    // Countdown logic
    useEffect(() => {
        const timer = setInterval(() => {
            if (!isCoolingDown) {
                setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [isCoolingDown]);

    // Toast Throttling Refs
    const lastErrorToastTime = useRef(0);
    const lastSuccessToastTime = useRef(0);

    // Error Notification (Toast) - Keep this for background refresh errors
    useEffect(() => {
        const now = Date.now();
        // Throttle error toasts to once every 30 seconds
        if (isError && displayedData && now - lastErrorToastTime.current > 30000) {
            toast.error('데이터 갱신 실패', {
                id: 'refresh-error', // Prevent duplicates
                description: '기존 데이터를 유지합니다.',
            });
            lastErrorToastTime.current = now;
        }
    }, [isError, displayedData]);

    const handleManualRefresh = () => {
        if (isCoolingDown) return;

        setIsCoolingDown(true);
        setTimeLeft(60); // Reset visual timer immediately

        mutate().then((newData) => {
            const now = Date.now();
            if (newData && now - lastSuccessToastTime.current > 5000) {
                toast.success('데이터가 갱신되었습니다.', {
                    id: 'refresh-success', // Prevent duplicates
                    duration: 2000
                });
                lastSuccessToastTime.current = now;
            }
        });

        // 5 seconds cooldown
        setTimeout(() => {
            setIsCoolingDown(false);
        }, 5000);
    };

    // 날짜별 그룹핑
    const groupedShips = filteredShips.reduce((acc, ship) => {
        const date = ship.date || '날짜 미상';
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(ship);
        return acc;
    }, {} as Record<string, typeof filteredShips>);

    // 스크롤 감지를 위한 상태
    const [isSticky, setIsSticky] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const sentinelRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        // Enable StatusBar overlay for transparent background effect
        if (Capacitor.isNativePlatform()) {
            StatusBar.setOverlaysWebView({ overlay: true }).catch(() => {
                // Ignore errors on web or if plugin not loaded
            });
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                // sentinel이 화면 상단 밖으로 나가면 sticky 상태
                const newIsSticky = !entry.isIntersecting && entry.boundingClientRect.top < 0;
                setIsSticky(newIsSticky);

                // webkit message handler removed to prevent UI freeze
            },
            { threshold: [0, 1] }
        );

        if (sentinelRef.current) {
            observer.observe(sentinelRef.current);
        }

        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            observer.disconnect();
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const { isDarkMode } = useTheme();

    // Show Error State only if we have NO data and there is an error
    const showFullScreenError = isError && !displayedData;

    return (
        <div className={`min-h-screen pb-10 select-none font-sans transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-white'}`}>
            {/* Toaster for Notifications */}
            <Toaster
                position="top-center"
                richColors
                closeButton
                style={{ marginTop: 'calc(env(safe-area-inset-top) + 16px)' }}
            />

            {/* Status Bar Background Cover for Sticky State */}
            <div
                className={`fixed top-0 left-0 right-0 z-[60] transition-colors duration-300 pointer-events-none ${isSticky ? 'bg-blue-600' : 'bg-transparent'}`}
                style={{ height: 'env(safe-area-inset-top)' }}
            />

            <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

            <div className="relative z-40">
                <Header
                    data={displayedData || null}
                    loading={isLoading || isCoolingDown}
                    onRefresh={handleManualRefresh}
                    timeLeft={timeLeft}
                    onOpenSettings={() => setIsSettingsOpen(true)}
                />
            </div>

            <div className={`max-w-md mx-auto px-4 -mt-6 relative z-0 transition-opacity duration-300 ${isLoading && !displayedData ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>

                {showFullScreenError ? (
                    <div className="mt-10">
                        <ErrorState onRetry={handleManualRefresh} />
                    </div>
                ) : (
                    <>
                        {/* Sentinel for Sticky Detection - Placed at the top of content to trigger exactly when it hits viewport top */}
                        <div ref={sentinelRef} className="absolute top-0 h-px w-full pointer-events-none bg-transparent" />

                        {/* Sticky Wrapper */}
                        <div
                            className="sticky z-30 bg-transparent"
                            style={{ top: 'env(safe-area-inset-top)' }}
                        >
                            <PilotDuty
                                pilots={displayedData?.pilots}
                                isStuck={isSticky}
                                onRefresh={handleManualRefresh}
                                loading={isLoading || isCoolingDown}
                                timeLeft={timeLeft}
                                onOpenSettings={() => setIsSettingsOpen(true)}
                            />
                            <div className={`${isSticky ? 'bg-blue-600 shadow-md rounded-b-xl -mx-4 px-4 pb-2 pt-0' : 'mb-2'}`}>
                                <FilterBar
                                    searchTerm={searchTerm}
                                    setSearchTerm={setSearchTerm}
                                    filter={statusFilter as FilterType}
                                    setFilter={(val) => setStatusFilter(val)}
                                />
                            </div>
                        </div>

                        <ShipList
                            groupedShips={groupedShips}
                            loading={isLoading && !displayedData}
                            isEmpty={!filteredShips || filteredShips.length === 0}
                            isFiltering={(searchTerm.length > 0 || statusFilter !== 'all')}
                        />
                    </>
                )}
            </div>

            {/* Scroll to Top Button */}
            <button
                onClick={scrollToTop}
                className={`fixed ${Capacitor.isNativePlatform() ? 'bottom-24' : 'bottom-8'} right-6 p-3 rounded-full shadow-lg bg-blue-600 text-white transition-all duration-300 z-[100] hover:bg-blue-700 active:scale-95 ${showScrollTop && !isSettingsOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
                aria-label="Scroll to top"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m18 15-6-6-6 6" />
                </svg>
            </button>

            {/* AdMob Banner (Native Only) */}
            <AdMobBanner />
        </div>
    );
}

import PrivacyView from './components/PrivacyView';
import TermsView from './components/TermsView';

export default function App() {
    // Simple routing for static pages
    const path = window.location.pathname;

    if (path === '/privacy') {
        return (
            <ThemeProvider>
                <div className="min-h-screen bg-white dark:bg-slate-800 p-6">
                    <PrivacyView onBack={() => window.location.href = '/'} />
                </div>
            </ThemeProvider>
        );
    }

    if (path === '/terms') {
        return (
            <ThemeProvider>
                <div className="min-h-screen bg-white dark:bg-slate-800 p-6">
                    <TermsView onBack={() => window.location.href = '/'} />
                </div>
            </ThemeProvider>
        );
    }

    return (
        <ThemeProvider>
            <AppContent />
        </ThemeProvider>
    );
}
