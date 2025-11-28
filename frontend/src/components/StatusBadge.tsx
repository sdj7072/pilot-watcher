import React from 'react';
import { useTheme } from '../context/ThemeContext';

interface StatusBadgeProps {
    status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
    const { isDarkMode } = useTheme();

    const getStatusStyle = (status: string) => {
        if (status === '완료') {
            return isDarkMode
                ? 'bg-slate-800 text-slate-400 border-slate-700'
                : 'bg-gray-100 text-gray-500 border-gray-200';
        }
        if (status === '취소') {
            return isDarkMode
                ? 'bg-red-900/30 text-red-400 border-red-800'
                : 'bg-red-50 text-red-600 border-red-100';
        }
        if (status.includes('예정')) {
            return isDarkMode
                ? 'bg-blue-900/30 text-blue-400 border-blue-800'
                : 'bg-blue-50 text-blue-600 border-blue-100';
        }
        // 승인 (Default) - Light Mode contrast improved
        return isDarkMode
            ? 'bg-green-900/30 text-green-400 border-green-800'
            : 'bg-green-100 text-green-700 border-green-200';
    };

    return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusStyle(status)}`}>
            {status}
        </span>
    );
}
