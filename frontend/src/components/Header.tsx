import { useState, useEffect } from 'react';
import { Ship, Sun, Moon, RefreshCw, Settings, AlertTriangle } from 'lucide-react';
import CircularTimer from './CircularTimer';
import { useTheme } from '../context/ThemeContext';
import { PilotData } from '../types';
import { NoticeSeverity } from './AnnouncementModal';

interface HeaderProps {
    data: PilotData | null;
    loading: boolean;
    onRefresh: () => void;
    timeLeft: number;
    onOpenSettings: () => void;
    onOpenAnnouncement: () => void;
    noticeSeverity: NoticeSeverity;
}

export default function Header({ data, loading, onRefresh, timeLeft, onOpenSettings, onOpenAnnouncement, noticeSeverity }: HeaderProps) {
    const { isDarkMode, toggleTheme } = useTheme();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const formatDate = (dateStr: string | undefined) => {
        if (!dateStr) return "정보를 읽어오는 중...";
        // "2025-11-28 금요일" -> "2025.11.28(금)"
        try {
            const [datePart, dayPart] = dateStr.split(' ');
            const formattedDate = datePart.replace(/-/g, '.');
            const shortDay = dayPart ? `(${dayPart[0]})` : '';
            return `${formattedDate}${shortDay}`;
        } catch {
            return dateStr;
        }
    };

    // Icon color based on severity
    const getIconColor = () => {
        switch (noticeSeverity) {
            case 'critical': return 'text-red-500';
            case 'warning': return 'text-amber-500';
            default: return '';
        }
    };

    return (
        <div
            className={`text-white px-6 transition-all duration-300 sticky top-0 z-50 shadow-xl ${isScrolled ? 'pb-2' : 'pb-6 rounded-b-3xl'} ${isDarkMode ? 'bg-gradient-to-br from-[#1e293b] to-[#0f172a]' : 'bg-gradient-to-br from-blue-600 to-blue-800'}`}
            style={{ paddingTop: 'calc(env(safe-area-inset-top) + 1.5rem)' }}
        >
            <div className={`flex justify-between items-start transition-all duration-300 ${isScrolled ? 'mb-0 items-center' : 'mb-4'}`}>
                <div className={`transition-all duration-300 overflow-hidden ${isScrolled ? 'w-0 h-0 opacity-0' : 'w-auto h-auto opacity-100'}`}>
                    <h1 className="text-lg sm:text-xl md:text-2xl font-bold flex items-center gap-2 tracking-tight whitespace-nowrap">
                        <Ship className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                        평택·당진항
                    </h1>
                    <p className="text-blue-100 text-xs sm:text-sm opacity-90 font-medium mt-1 whitespace-nowrap">
                        {formatDate(data?.dateInfo)}
                    </p>
                </div>

                {/* Buttons Container - Always visible, moves to right on scroll */}
                <div className={`flex gap-1.5 sm:gap-2 transition-all duration-300 ${isScrolled ? 'ml-auto' : ''}`}>
                    <button
                        onClick={onOpenAnnouncement}
                        className="shrink-0 flex items-center justify-center bg-white/10 rounded-full hover:bg-white/20 active:scale-95 transition backdrop-blur-sm"
                        style={{ width: 40, height: 40, minWidth: 40, minHeight: 40 }}
                        aria-label="View Announcements"
                    >
                        <AlertTriangle size={20} className={getIconColor()} />
                    </button>
                    <button
                        onClick={() => toggleTheme()}
                        className="shrink-0 flex items-center justify-center bg-white/10 rounded-full hover:bg-white/20 active:scale-95 transition backdrop-blur-sm"
                        style={{ width: 40, height: 40, minWidth: 40, minHeight: 40 }}
                        aria-label="Toggle Dark Mode"
                    >
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <button
                        onClick={onOpenSettings}
                        className="shrink-0 flex items-center justify-center bg-white/10 rounded-full hover:bg-white/20 active:scale-95 transition backdrop-blur-sm"
                        style={{ width: 40, height: 40, minWidth: 40, minHeight: 40 }}
                        aria-label="Open Settings"
                    >
                        <Settings size={20} />
                    </button>
                    <button
                        onClick={() => onRefresh()}
                        disabled={loading}
                        className={`rounded-full active:scale-95 transition backdrop-blur-sm flex items-center justify-center ${loading ? 'cursor-not-allowed opacity-50' : 'hover:bg-white/10'}`}
                        aria-label="Refresh Data"
                    >
                        <CircularTimer
                            timeLeft={timeLeft}
                            maxTime={60}
                            size={40}
                            strokeWidth={3}
                            className="text-white"
                        >
                            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                        </CircularTimer>
                    </button>
                </div>
            </div>

            {/* Sun/Moon Info - Hide on scroll */}
            <div className={`flex flex-col gap-2 text-xs font-semibold bg-black/20 p-3 rounded-xl backdrop-blur-md border border-white/10 transition-all duration-300 overflow-hidden ${isScrolled ? 'h-0 opacity-0 p-0 m-0 border-0' : 'h-auto opacity-100'}`}>
                {/* Row 1: Sunrise / Sunset */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-yellow-300">
                        <Sun size={14} />
                        <span>
                            {(() => {
                                const match = data?.sunInfo.match(/일출:\s*(\d{2}:\d{2})/);
                                return match ? `일출 ${match[1]}` : "일출 --:--";
                            })()}
                        </span>
                    </div>
                    <div className="w-px bg-white/20 h-3 mx-2"></div>
                    <div className="flex items-center gap-1.5 text-orange-200">
                        <Moon size={14} />
                        <span>
                            {(() => {
                                const match = data?.sunInfo.match(/일몰:\s*(\d{2}:\d{2})/);
                                return match ? `일몰 ${match[1]}` : "일몰 --:--";
                            })()}
                        </span>
                    </div>
                </div>

                {/* Row 2: Night Time */}
                <div className="flex items-center gap-1.5 text-blue-200 border-t border-white/10 pt-2 mt-0.5">
                    <Moon size={14} className="text-blue-300" />
                    <span>
                        {(() => {
                            const match = data?.sunInfo.match(/NIGHT TIME\s*:\s*(\d{2}:\d{2}\s*~\s*\d{2}:\d{2})/);
                            return match ? `Night Time ${match[1]}` : "Night Time --:-- ~ --:--";
                        })()}
                    </span>
                </div>
            </div>
        </div>
    );
}
