import { Ship, Sun, Moon, RefreshCw } from 'lucide-react';
import CircularTimer from './CircularTimer';
import { useTheme } from '../context/ThemeContext';
import { PilotData } from '../types';

interface HeaderProps {
    data: PilotData | null;
    loading: boolean;
    onRefresh: () => void;
    timeLeft: number;
}

export default function Header({ data, loading, onRefresh, timeLeft }: HeaderProps) {
    const { isDarkMode, toggleTheme } = useTheme();

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

    return (
        <div className={`text-white p-6 rounded-b-3xl shadow-xl relative z-10 transition-colors duration-300 ${isDarkMode ? 'bg-gradient-to-br from-[#1e293b] to-[#0f172a]' : 'bg-gradient-to-br from-blue-600 to-blue-800'}`}>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                        <Ship size={24} className="md:w-7 md:h-7" />
                        평택·당진항 도선 현황
                    </h1>
                    <p className="text-blue-100 text-sm opacity-90 font-medium mt-1">
                        {formatDate(data?.dateInfo)}
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => toggleTheme()}
                        className="p-2.5 bg-white/10 rounded-full hover:bg-white/20 active:scale-95 transition backdrop-blur-sm"
                        aria-label="Toggle Dark Mode"
                    >
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
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

            {/* Sun/Moon Info */}
            <div className="flex flex-col gap-2 text-xs font-semibold bg-black/20 p-3 rounded-xl backdrop-blur-md border border-white/10">
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
