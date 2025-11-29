import { Anchor, ArrowUpCircle, LogIn, LogOut, RefreshCw } from 'lucide-react';

export const getPilotType = (sections: string[]) => {
    if (!sections || sections.length < 2) return null;

    const from = sections[0].toUpperCase();
    const to = sections[sections.length - 1].toUpperCase();

    const isSea = (loc: string) => ['P.S', 'E12', 'E-12', 'E14', 'E-14', 'E16', 'E-16', 'NO.1', 'NO.2'].some(k => loc.includes(k));
    const isAnchor = (loc: string) => ['ANCH', '묘박'].some(k => loc.includes(k));

    if (isAnchor(to)) return { type: '투묘', icon: Anchor, color: 'text-purple-500 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300' };
    if (isAnchor(from)) return { type: '양묘', icon: ArrowUpCircle, color: 'text-indigo-500 bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300' };
    if (isSea(from) && !isSea(to)) return { type: '입항', icon: LogIn, color: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300' };
    if (!isSea(from) && isSea(to)) return { type: '출항', icon: LogOut, color: 'text-orange-500 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-300' };
    if (!isSea(from) && !isSea(to)) return { type: '이항', icon: RefreshCw, color: 'text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300' };

    return null;
};
