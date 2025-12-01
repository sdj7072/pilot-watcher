import React from 'react';
import { Calendar, Ship } from 'lucide-react';
import ShipCard from './ShipCard';
import Skeleton from './Skeleton';
import { Ship as ShipType } from '../types';

interface ShipListProps {
    groupedShips: Record<string, ShipType[]> | undefined;
    loading: boolean;
    isEmpty: boolean;
}

import { useTheme } from '../context/ThemeContext';

export default function ShipList({ groupedShips, loading, isEmpty }: ShipListProps) {
    const { isDarkMode } = useTheme();

    if (loading && !groupedShips) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} />
                ))}
            </div>
        );
    }

    if (isEmpty) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-600">
                <Ship size={40} className="mb-2 opacity-20" />
                <p>조건에 맞는 선박이 없습니다.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-20">
            {groupedShips && Object.keys(groupedShips).sort().map((date) => (
                <div key={date}>
                    <div
                        className="sticky top-[115px] z-10 py-3 -mx-4 px-5 flex items-center gap-2 transition-colors duration-300"
                        style={{ backgroundColor: isDarkMode ? '#0f172a' : '#ffffff' }}
                        onClick={() => { /* TODO: Add functionality here if needed */ }}
                    >
                        <Calendar size={14} className="text-gray-400 dark:text-gray-500" />
                        <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400">
                            {(() => {
                                try {
                                    // "11-28" -> "11.28(금)"
                                    const [month, day] = date.split('-').map(Number);
                                    const currentYear = new Date().getFullYear();
                                    const dateObj = new Date(currentYear, month - 1, day);
                                    const days = ['일', '월', '화', '수', '목', '금', '토'];
                                    const dayName = days[dateObj.getDay()];
                                    return `${month.toString().padStart(2, '0')}.${day.toString().padStart(2, '0')}(${dayName})`;
                                } catch {
                                    return date;
                                }
                            })()}
                        </h3>
                        <div className="h-px bg-gray-200 dark:bg-gray-800 flex-1"></div>
                    </div>
                    <div className="space-y-3">
                        {groupedShips[date].map((ship, idx) => (
                            <ShipCard key={`${date}-${idx}`} ship={ship} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
