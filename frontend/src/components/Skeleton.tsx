

export default function Skeleton() {
    return (
        <div className="bg-white dark:bg-[#1e293b] rounded-xl p-4 shadow-sm border border-gray-100 dark:border-slate-800 animate-pulse">
            {/* Top Row: Time & Status */}
            <div className="flex justify-between items-start mb-2">
                <div className="h-4 w-12 bg-gray-200 dark:bg-slate-700 rounded"></div>
                <div className="h-6 w-16 bg-gray-200 dark:bg-slate-700 rounded-full"></div>
            </div>

            {/* Middle: Name & Tags */}
            <div className="mb-3">
                <div className="flex items-center gap-2 mb-2">
                    <div className="h-4 w-4 bg-gray-200 dark:bg-slate-700 rounded-full"></div>
                    <div className="h-5 w-32 bg-gray-200 dark:bg-slate-700 rounded"></div>
                </div>
                <div className="flex gap-1">
                    <div className="h-5 w-12 bg-gray-100 dark:bg-slate-800 rounded"></div>
                    <div className="h-5 w-10 bg-gray-100 dark:bg-slate-800 rounded"></div>
                    <div className="h-5 w-14 bg-gray-100 dark:bg-slate-800 rounded"></div>
                </div>
            </div>

            {/* Bottom Row: Type/Agency & Pilot */}
            <div className="flex justify-between items-end pt-3 mt-2 border-t border-gray-50 dark:border-slate-800">
                <div className="flex flex-col gap-1">
                    <div className="h-3 w-20 bg-gray-100 dark:bg-slate-800 rounded"></div>
                </div>
                <div className="h-7 w-16 bg-blue-50 dark:bg-blue-900/20 rounded"></div>
            </div>
        </div>
    );
}
