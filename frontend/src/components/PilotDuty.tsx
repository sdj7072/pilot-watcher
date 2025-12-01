import { Anchor, Sun, Moon, RefreshCw, Settings } from 'lucide-react';
import CircularTimer from './CircularTimer';
import { useTheme } from '../context/ThemeContext';

interface PilotDutyProps {
    pilots: string[] | undefined;
    isStuck?: boolean;
    onRefresh?: () => void;
    loading?: boolean;
    timeLeft?: number;
    onOpenSettings?: () => void;
}

export default function PilotDuty({ isStuck, onRefresh, loading, timeLeft, onOpenSettings }: PilotDutyProps) {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <div className={`transition-all duration-300 ${isStuck
            ? 'pt-3 pb-1 px-5 -mx-4 bg-blue-600 z-30 relative flex justify-between items-center'
            : `rounded-2xl px-5 pt-8 pb-3 shadow-sm border mb-3 relative ${isDarkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-gray-100'}`
            }`}>
            <h2 className={`font-bold flex items-center gap-2 text-sm transition-all duration-300 ${isStuck
                ? 'text-white'
                : (isDarkMode ? 'text-blue-400' : 'text-blue-600')
                }`}>
                <Anchor size={16} className={isStuck ? "text-blue-200" : ""} />
                Today's Pilots
            </h2>

            {isStuck && (
                <div className="flex gap-2">
                    {onOpenSettings && (
                        <button
                            onClick={onOpenSettings}
                            className="p-1.5 bg-white/10 rounded-full hover:bg-white/20 active:scale-95 transition backdrop-blur-sm text-white shrink-0 flex items-center justify-center"
                            style={{ width: 32, height: 32, minWidth: 32, minHeight: 32 }}
                            aria-label="Open Settings"
                        >
                            <Settings size={16} />
                        </button>
                    )}
                    <button
                        onClick={toggleTheme}
                        className="p-1.5 bg-white/10 rounded-full hover:bg-white/20 active:scale-95 transition backdrop-blur-sm text-white shrink-0 flex items-center justify-center"
                        style={{ width: 32, height: 32, minWidth: 32, minHeight: 32 }}
                        aria-label="Toggle Dark Mode"
                    >
                        {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                    </button>
                    {onRefresh && (
                        <button
                            onClick={onRefresh}
                            disabled={loading}
                            className={`rounded-full active:scale-95 transition backdrop-blur-sm flex items-center justify-center ${loading ? 'cursor-not-allowed opacity-50' : 'hover:bg-white/10'}`}
                            aria-label="Refresh Data"
                        >
                            <CircularTimer
                                timeLeft={timeLeft || 0}
                                maxTime={60}
                                size={32}
                                strokeWidth={3}
                                className="text-white"
                            >
                                <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                            </CircularTimer>
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
