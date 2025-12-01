import React from 'react';
import { Search } from 'lucide-react';
import { FilterType } from '../types';
import { useTheme } from '../context/ThemeContext';

interface FilterBarProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    filter: FilterType;
    setFilter: (filter: FilterType) => void;
}

export default function FilterBar(props: FilterBarProps) {
    const { searchTerm, setSearchTerm } = props;
    const { isDarkMode } = useTheme();

    return (
        <div className="pt-2 pb-2 transition-colors duration-300">
            <div className="relative group">
                <Search className="absolute left-3.5 top-3.5 text-gray-600 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                <input
                    type="text"
                    value={searchTerm}
                    placeholder="선박명 또는 대리점 검색..."
                    className={`w-full pl-11 pr-4 py-3 rounded-xl border-0 shadow-sm ring-1 focus:ring-2 focus:ring-blue-500 transition-all outline-none ${isDarkMode ? 'bg-slate-900 ring-slate-700 text-slate-200 placeholder-slate-500' : 'bg-white ring-gray-400 text-gray-700 placeholder-gray-400'}`}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>


        </div>
    );
}
