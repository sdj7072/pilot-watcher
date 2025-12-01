import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import PilotDuty from './components/PilotDuty';
import FilterBar from './components/FilterBar';
import ShipList from './components/ShipList';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { FilterType, PilotData } from './types';
import { usePilotData } from './hooks/usePilotData';
import { useShipFilter } from './hooks/useShipFilter';
import { Toaster, toast } from 'sonner';
import { AlertCircle, RefreshCw } from 'lucide-react';

const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center animate-in fade-in zoom-in duration-300">
        <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-full mb-4 shadow-sm">
            <AlertCircle className="w-12 h-12 text-red-500 dark:text-red-400" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            데이터를 불러오지 못했습니다
        </h3>
        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-xs leading-relaxed">
            일시적인 오류일 수 있습니다.<br />잠시 후 다시 시도해주세요.
        </p>
        <button
            onClick={onRetry}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl font-medium transition-all flex items-center gap-2 shadow-lg shadow-blue-600/20"
        >
            <RefreshCw className="w-5 h-5" />
            다시 시도하기
        </button>
    </div>
);

function AppContent() {
    const { data: fetchedData, isLoading, isError, mutate, isValidating } = usePilotData();
    const [displayedData, setDisplayedData] = useState<PilotData | null>(null);
    const { searchTerm, setSearchTerm, statusFilter, setStatusFilter, filteredShips } = useShipFilter(displayedData?.ships);

    // Always sync displayedData with fetchedData immediately
    useEffect(() => {
        if (fetchedData) {
            setDisplayedData(fetchedData);
        }
    }, [fetchedData]);

    // SWR handles auto-refresh, but we still need a countdown timer for UI
    const [timeLeft, setTimeLeft] = useState(60);

    // Reset timer when validation finishes (fix for bug #3)
    useEffect(() => {
        if (!isValidating) {
            setTimeLeft(60);
        }
    }, [isValidating]);

    // Countdown logic
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Error Notification (Toast) - Keep this for background refresh errors
    useEffect(() => {
        if (isError && displayedData) {
            toast.error('데이터 갱신 실패', {
                description: '기존 데이터를 유지합니다.',
            });
        }
    }, [isError, displayedData]);

    const handleManualRefresh = () => {
        mutate().then((newData) => {
            if (newData) {
                setDisplayedData(newData);
                toast.success('데이터가 갱신되었습니다.', { duration: 2000 });
            }
        });
        setTimeLeft(60);
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
        const observer = new IntersectionObserver(
            ([entry]) => {
                // sentinel이 화면 상단 밖으로 나가면 sticky 상태
                const newIsSticky = !entry.isIntersecting && entry.boundingClientRect.top < 0;
                setIsSticky(newIsSticky);

                // Send sticky state to iOS Native App
                if ((window as any).webkit?.messageHandlers?.stickyHandler) {
                    (window as any).webkit.messageHandlers.stickyHandler.postMessage(newIsSticky);
                }
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
            <Toaster position="top-center" richColors closeButton />

            <Header
                data={displayedData || null}
                loading={isLoading}
                onRefresh={handleManualRefresh}
                timeLeft={timeLeft}
            />

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
                        <div className="sticky top-0 z-30 bg-transparent">
                            <PilotDuty
                                pilots={displayedData?.pilots}
                                isStuck={isSticky}
                                onRefresh={handleManualRefresh}
                                loading={isLoading}
                                timeLeft={timeLeft}
                            />
                            <div className={`${isSticky ? 'bg-blue-600 shadow-md rounded-b-xl -mx-4 px-4 pb-2 pt-0' : 'mb-2'} transition-all duration-300`}>
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
                        />
                    </>
                )}
            </div>

            {/* Scroll to Top Button */}
            <button
                onClick={scrollToTop}
                className={`fixed bottom-8 right-6 p-3 rounded-full shadow-lg bg-blue-600 text-white transition-all duration-300 z-[100] hover:bg-blue-700 active:scale-95 ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
                aria-label="Scroll to top"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m18 15-6-6-6 6" />
                </svg>
            </button>
        </div>
    );
}

export default function App() {
    return (
        <ThemeProvider>
            <AppContent />
        </ThemeProvider>
    );
}
