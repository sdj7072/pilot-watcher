import React from 'react';

export default function Skeleton() {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 animate-pulse">
            <div className="flex justify-between items-start mb-2">
                <div className="flex flex-col gap-1">
                    <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-3 w-24 bg-gray-100 dark:bg-gray-700 rounded"></div>
                </div>
                <div className="h-6 w-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            </div>

            <div className="mb-3 mt-2">
                <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="flex gap-1">
                    <div className="h-4 w-12 bg-gray-100 dark:bg-gray-700 rounded"></div>
                    <div className="h-4 w-10 bg-gray-100 dark:bg-gray-700 rounded"></div>
                </div>
            </div>

            <div className="flex justify-between items-end pt-3 mt-2 border-t border-gray-50 dark:border-gray-700">
                <div className="h-3 w-20 bg-gray-100 dark:bg-gray-700 rounded"></div>
                <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
        </div>
    );
}
