import React from 'react';
import { Ship, Sun, Moon, RefreshCw } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { PilotData } from '../types';

interface HeaderProps {
    data: PilotData | null;
    loading: boolean;
    onRefresh: () => void;
}

export default function Header({ data, loading, onRefresh }: HeaderProps) {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <div className={`text-white p-6 rounded-b-3xl shadow-xl sticky top-0 z-10 transition-colors duration-300 ${isDarkMode ? 'bg-gradient-to-br from-[#1e293b] to-[#0f172a]' : 'bg-gradient-to-br from-blue-600 to-blue-800'}`}>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Ship className="w-7 h-7" />
                        평택항 도선
                    </h1>
                    <p className="text-blue-100 text-sm opacity-90 font-medium mt-1">
                        {data?.dateInfo || "데이터 로딩 중..."}
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={toggleTheme}
                        className="p-2.5 bg-white/10 rounded-full hover:bg-white/20 active:scale-95 transition backdrop-blur-sm"
                        aria-label="Toggle Dark Mode"
                    >
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <button
                        onClick={onRefresh}
                        className="p-2.5 bg-white/10 rounded-full hover:bg-white/20 active:scale-95 transition backdrop-blur-sm"
                        aria-label="Refresh Data"
                    >
                        <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                    </button>
                </div>
            </div>

            <div className="flex gap-3 text-xs font-semibold bg-black/20 p-3 rounded-xl backdrop-blur-md border border-white/10">
                <div className="flex items-center gap-1.5 text-yellow-300">
                    <Sun size={14} /> <span>{data?.sunInfo.split('일몰')[0] || "일출 정보"}</span>
                </div>
                <div className="w-px bg-white/20 h-4"></div>
                <div className="flex items-center gap-1.5 text-orange-200">
                    <Moon size={14} /> <span>{data?.sunInfo.split('일출')[1] || "일몰 정보"}</span>
                </div>
            </div>
        </div>
    );
}
