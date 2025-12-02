import { useState } from 'react';
import { Calendar } from 'lucide-react';
import ShipCard from './ShipCard';
import Skeleton from './Skeleton';
import { Ship as ShipType } from '../types';

interface ShipListProps {
    groupedShips: Record<string, ShipType[]> | undefined;
    loading: boolean;
    isEmpty: boolean;
    isFiltering: boolean;
}

import { useTheme } from '../context/ThemeContext';
import { SearchX, Anchor } from 'lucide-react';

export default function ShipList({ groupedShips, loading, isEmpty, isFiltering }: ShipListProps) {
    const { isDarkMode } = useTheme();

    const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

    const handleCardToggle = (cardId: string) => {
        const isOpening = expandedCardId !== cardId;
        setExpandedCardId((prev: string | null) => prev === cardId ? null : cardId);

        if (isOpening) {
            // Wait for state update and DOM render
            setTimeout(() => {
                const element = document.getElementById(`card-${cardId}`);
                if (element) {
                    element.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }, 100);
        }
    };

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
            <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-600 animate-in fade-in zoom-in duration-300">
                {isFiltering ? (
                    <>
                        <SearchX size={48} className="mb-3 opacity-20" />
                        <p className="font-medium">검색 결과가 없습니다.</p>
                        <p className="text-xs mt-1 opacity-70">다른 검색어나 필터로 시도해 보세요.</p>
                    </>
                ) : (
                    <>
                        <Anchor size={48} className="mb-3 opacity-20" />
                        <p className="font-medium">예정된 도선 작업이 없습니다.</p>
                        <p className="text-xs mt-1 opacity-70">새로운 정보가 업데이트되면 알려드릴게요.</p>
                    </>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-20">
            {groupedShips && Object.keys(groupedShips).sort().map((date) => (
                <div key={date}>
                    <div
                        className="sticky z-10 pt-5 pb-2 -mx-4 px-5 flex items-center gap-2 transition-all duration-300"
                        style={{
                            backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
                            top: `calc(env(safe-area-inset-top) + 108px)`
                        }}
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
                    <div className="space-y-4">
                        {groupedShips[date].map((ship, idx) => {
                            const cardId = `${date}-${idx}`;
                            return (
                                <div
                                    key={cardId}
                                    id={`card-${cardId}`}
                                    style={{ scrollMarginTop: 'calc(env(safe-area-inset-top) + 160px)' }}
                                >
                                    <ShipCard
                                        ship={ship}
                                        isExpanded={expandedCardId === cardId}
                                        onToggle={() => handleCardToggle(cardId)}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}
