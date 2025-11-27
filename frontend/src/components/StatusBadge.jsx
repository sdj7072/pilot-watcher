import React from 'react';

export default function StatusBadge({ status }) {
    let colorClass = "bg-gray-100 text-gray-600 border-gray-200"; // Default

    if (status === '완료') {
        colorClass = "bg-green-100 text-green-700 border-green-200";
    } else if (status === '승인') {
        colorClass = "bg-blue-100 text-blue-700 border-blue-200";
    } else if (status === '요청') {
        colorClass = "bg-orange-100 text-orange-700 border-orange-200";
    } else if (status.includes('특') || status.includes('긴')) {
        colorClass = "bg-red-100 text-red-700 border-red-200";
    }

    return (
        <span className={`text-[11px] font-bold px-2 py-0.5 border rounded-full ${colorClass}`}>
            {status}
        </span>
    );
}
