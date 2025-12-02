import { Box } from 'lucide-react';

interface LicenseIconProps {
    name: string;
    className?: string;
}

export default function LicenseIcon({ name, className = '' }: LicenseIconProps) {
    const lowerName = name.toLowerCase();

    // React
    if (lowerName.includes('react') && !lowerName.includes('lucide')) {
        return (
            <div className={`flex items-center justify-center w-10 h-10 rounded-full bg-[#20232a] ${className}`}>
                <svg viewBox="-10.5 -9.45 21 18.9" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#61dafb]">
                    <circle cx="0" cy="0" r="2" fill="currentColor"></circle>
                    <g stroke="currentColor" strokeWidth="1" fill="none">
                        <ellipse rx="10" ry="4.5"></ellipse>
                        <ellipse rx="10" ry="4.5" transform="rotate(60)"></ellipse>
                        <ellipse rx="10" ry="4.5" transform="rotate(120)"></ellipse>
                    </g>
                </svg>
            </div>
        );
    }

    // Vite
    if (lowerName.includes('vite')) {
        return (
            <div className={`flex items-center justify-center w-10 h-10 rounded-full bg-[#1b1b1f] ${className}`}>
                <svg viewBox="0 0 410 404" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
                    <path d="M399.641 43.491L383.989 8.785C382.78 6.095 379.79 4.675 376.91 5.375L71.39 79.175L20.8 28.575C18.6 26.375 15.1 26.375 12.9 28.575L2.6 38.875C-0.3 41.775 -0.8 46.275 1.5 49.675L194.8 395.775C196.6 398.975 199.9 400.975 203.6 400.975H206.4C210.1 400.975 213.4 398.975 215.2 395.775L408.5 49.675C410.8 46.275 410.3 41.775 407.4 38.875L399.641 43.491Z" fill="url(#vite_grad)" />
                    <defs>
                        <linearGradient id="vite_grad" x1="205" y1="18" x2="205" y2="401" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#41D1FF" />
                            <stop offset="1" stopColor="#BD34FE" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
        );
    }

    // Tailwind CSS
    if (lowerName.includes('tailwind')) {
        return (
            <div className={`flex items-center justify-center w-10 h-10 rounded-full bg-[#0f172a] ${className}`}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#38bdf8]">
                    <path d="M12.0002 11.9998C12.0002 11.9998 14.4002 12.5998 15.6002 14.3998C16.8002 16.1998 15.6002 18.5998 13.8002 18.5998C12.0002 18.5998 10.8002 16.7998 12.0002 14.9998C12.0002 14.9998 9.6002 14.3998 8.4002 12.5998C7.2002 10.7998 8.4002 8.3998 10.2002 8.3998C12.0002 8.3998 13.2002 10.1998 12.0002 11.9998ZM12.0002 11.9998C12.0002 11.9998 14.4002 12.5998 15.6002 10.7998C16.8002 8.9998 15.6002 6.5998 13.8002 6.5998C12.0002 6.5998 10.8002 8.3998 12.0002 10.1998C12.0002 10.1998 9.6002 10.7998 8.4002 12.5998C7.2002 14.3998 8.4002 16.7998 10.2002 16.7998C12.0002 16.7998 13.2002 14.9998 12.0002 13.1998" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
        );
    }

    // Capacitor
    if (lowerName.includes('capacitor')) {
        return (
            <div className={`flex items-center justify-center w-10 h-10 rounded-full bg-white ${className}`}>
                <svg viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#1199FA]">
                    <path d="M404.3 107.7C364.8 68.2 312.4 46.5 256.5 46.5C200.6 46.5 148.2 68.2 108.7 107.7C69.2 147.2 47.5 199.6 47.5 255.5C47.5 311.4 69.2 363.8 108.7 403.3C148.2 442.8 200.6 464.5 256.5 464.5C312.4 464.5 364.8 442.8 404.3 403.3C443.8 363.8 465.5 311.4 465.5 255.5C465.5 199.6 443.8 147.2 404.3 107.7ZM256.5 417.5C167.1 417.5 94.5 344.9 94.5 255.5C94.5 166.1 167.1 93.5 256.5 93.5C345.9 93.5 418.5 166.1 418.5 255.5C418.5 344.9 345.9 417.5 256.5 417.5Z" fill="currentColor" />
                    <path d="M256.5 140.5L156.5 313.5H356.5L256.5 140.5Z" fill="currentColor" />
                </svg>
            </div>
        );
    }

    // TypeScript
    if (lowerName.includes('typescript')) {
        return (
            <div className={`flex items-center justify-center w-10 h-10 rounded-full bg-[#3178c6] ${className}`}>
                <span className="text-white font-bold text-xs">TS</span>
            </div>
        );
    }

    // Lucide
    if (lowerName.includes('lucide')) {
        return (
            <div className={`flex items-center justify-center w-10 h-10 rounded-full bg-[#F05133] ${className}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white">
                    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                </svg>
            </div>
        );
    }

    // SWR
    if (lowerName.includes('swr')) {
        return (
            <div className={`flex items-center justify-center w-10 h-10 rounded-full bg-black ${className}`}>
                <span className="text-white font-bold text-xs">SWR</span>
            </div>
        );
    }

    // Sonner
    if (lowerName.includes('sonner')) {
        return (
            <div className={`flex items-center justify-center w-10 h-10 rounded-full bg-white border border-gray-200 ${className}`}>
                <span className="text-black font-bold text-xs">So</span>
            </div>
        );
    }

    // Default Fallback
    return (
        <div className={`flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-slate-700 ${className}`}>
            <Box size={20} className="text-gray-500 dark:text-slate-400" />
        </div>
    );
}
