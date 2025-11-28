import React from 'react';
import { Anchor, Sun, Moon, RefreshCw } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface PilotDutyProps {
    pilots: string[] | undefined;
    isStuck?: boolean;
    onRefresh?: () => void;
    loading?: boolean;
    timeLeft?: number;
}

export default function PilotDuty({ pilots, isStuck = false, onRefresh, loading = false, timeLeft = 60 }: PilotDutyProps) {
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
                    <button
                        onClick={toggleTheme}
                        className="p-1.5 bg-white/10 rounded-full hover:bg-white/20 active:scale-95 transition backdrop-blur-sm text-white"
                        aria-label="Toggle Dark Mode"
                    >
                        {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                    </button>
                    {onRefresh && (
                        <button
                            onClick={onRefresh}
                            disabled={loading}
                            className={`p-1.5 rounded-full active:scale-95 transition backdrop-blur-sm flex items-center gap-1.5 text-white ${loading ? 'bg-blue-500/50 cursor-not-allowed' : 'bg-white/10 hover:bg-white/20'}`}
                            aria-label="Refresh Data"
                        >
                            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                            <span className="text-xs tabular-nums font-medium opacity-90 w-[40px] text-center">
                                {loading ? "..." : (
                                    <>
                                        {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:
                                        {(timeLeft % 60).toString().padStart(2, '0')}
                                    </>
                                )}
                            </span>
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
