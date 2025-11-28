import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import PilotDuty from './components/PilotDuty';
import FilterBar from './components/FilterBar';
import ShipList from './components/ShipList';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { PilotData, FilterType } from './types';

// 환경 변수 또는 기본값 사용
const API_URL = import.meta.env.VITE_API_URL || "https://backend.pilot-watcher.workers.dev";

function AppContent() {
    const [data, setData] = useState<PilotData | null>(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<FilterType>('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState<string | null>(null);
    const { isDarkMode } = useTheme();

    const fetchData = useCallback(async (isAutoRefresh = false) => {
        if (!isAutoRefresh) setLoading(true);
        setError(null);
        try {
            // 캐시 방지를 위한 타임스탬프 추가
            const url = `${API_URL}?t=${new Date().getTime()}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error('Network response was not ok');
            const json = await res.json();
            setData(json);
        } catch (err) {
            console.error("데이터 통신 에러:", err);
            setError("데이터를 불러오지 못했습니다.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();

        // 60초마다 자동 새로고침
        const interval = setInterval(() => {
            fetchData(true);
        }, 60000);

        return () => clearInterval(interval);
    }, [fetchData]);

    // 필터링 로직
    const filteredShips = data?.ships.filter(ship => {
        const statusMatch = filter === 'ALL' ||
            (filter === 'ING' && ship.status !== '완료') ||
            (filter === 'DONE' && ship.status === '완료');

        const term = searchTerm.toUpperCase();
        const nameMatch = ship.name.toUpperCase().includes(term) ||
            (ship.agency && ship.agency.toUpperCase().includes(term));

        return statusMatch && nameMatch;
    });

    // 날짜별 그룹핑
    const groupedShips = filteredShips?.reduce((acc, ship) => {
        const date = ship.date || '날짜 미상';
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(ship);
        return acc;
    }, {} as Record<string, typeof filteredShips>);

    return (
        <div className={`min-h-screen pb-10 select-none font-sans transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-gray-50'}`}>
            <Header
                data={data}
                loading={loading}
                onRefresh={() => fetchData(false)}
            />

            <div className="max-w-md mx-auto px-4 -mt-6 relative z-0">
                <PilotDuty pilots={data?.pilots} />

                <FilterBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    filter={filter}
                    setFilter={setFilter}
                />

                {error ? (
                    <div className="text-center py-10 text-red-500 dark:text-red-400">
                        <p>{error}</p>
                        <button
                            onClick={() => fetchData(false)}
                            className="mt-4 px-4 py-2 bg-red-100 dark:bg-red-900/30 rounded-lg text-sm font-bold hover:bg-red-200 dark:hover:bg-red-900/50 transition"
                        >
                            다시 시도
                        </button>
                    </div>
                ) : (
                    <ShipList
                        groupedShips={groupedShips}
                        loading={loading}
                        isEmpty={!filteredShips || filteredShips.length === 0}
                    />
                )}
            </div>
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
