import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import PilotDuty from './components/PilotDuty';
import FilterBar from './components/FilterBar';
import ShipList from './components/ShipList';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { FilterType } from './types';
import { usePilotData } from './hooks/usePilotData';
import { useShipFilter } from './hooks/useShipFilter';

function AppContent() {
    const { data, isLoading, isError, mutate } = usePilotData();
    const { searchTerm, setSearchTerm, statusFilter, setStatusFilter, filteredShips } = useShipFilter(data?.ships);

    // SWR handles auto-refresh, but we still need a countdown timer for UI
    const [timeLeft, setTimeLeft] = useState(60);

    // Reset timer when data updates
    useEffect(() => {
        setTimeLeft(60);
    }, [data]);

    // Countdown logic
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleManualRefresh = () => {
        mutate(); // Trigger SWR revalidation
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
                setIsSticky(!entry.isIntersecting && entry.boundingClientRect.top < 0);
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

    return (
        <div className={`min-h-screen pb-10 select-none font-sans transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-white'}`}>
            <Header
                data={data || null}
                loading={isLoading}
                onRefresh={handleManualRefresh}
                timeLeft={timeLeft}
            />

            <div className={`max-w-md mx-auto px-4 -mt-6 relative z-0 transition-opacity duration-300 ${isLoading && !data ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>

                {/* Sentinel for Sticky Detection - Placed at the top of content to trigger exactly when it hits viewport top */}
                <div ref={sentinelRef} className="absolute top-0 h-px w-full pointer-events-none bg-transparent" />

                {/* Sticky Wrapper */}
                <div className="sticky top-0 z-30 bg-transparent">
                    <PilotDuty
                        pilots={data?.pilots}
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

                {isError ? (
                    <div className="text-center py-10 text-red-500 dark:text-red-400">
                        <p>데이터를 불러오지 못했습니다.</p>
                        <button
                            onClick={handleManualRefresh}
                            className="mt-4 px-4 py-2 bg-red-100 dark:bg-red-900/30 rounded-lg text-sm font-bold hover:bg-red-200 dark:hover:bg-red-900/50 transition"
                        >
                            다시 시도
                        </button>
                    </div>
                ) : (
                    <ShipList
                        groupedShips={groupedShips}
                        loading={isLoading && !data}
                        isEmpty={!filteredShips || filteredShips.length === 0}
                    />
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
