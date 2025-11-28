import React from 'react';
import { Anchor } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface PilotDutyProps {
    pilots: string[] | undefined;
}

export default function PilotDuty({ pilots }: PilotDutyProps) {
    const { isDarkMode } = useTheme();

    return (
        <div className={`rounded-2xl p-5 shadow-sm border mb-6 transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-gray-100'}`}>
            <h2 className={`font-bold mb-3 flex items-center gap-2 text-sm uppercase tracking-wider ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                <Anchor size={16} /> Today's Pilot
            </h2>
            <div className="grid grid-cols-2 gap-2">
                {pilots?.slice(0, 4).map((p, i) => (
                    <div key={i} className={`px-3 py-2 rounded-lg text-sm font-medium border text-center transition-colors ${isDarkMode ? 'bg-slate-800 text-slate-200 border-slate-700' : 'bg-gray-50 text-gray-700 border-gray-100'}`}>
                        {p}
                    </div>
                ))}
                {!pilots && (
                    <div className="col-span-2 text-center text-gray-400 text-sm py-2">
                        정보를 불러오는 중...
                    </div>
                )}
            </div>
        </div>
    );
}
