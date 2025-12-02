import { useState, useRef } from 'react';
import { ChevronLeft, ChevronDown, ChevronUp, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { licenses } from '../data/licenses';
import LicenseIcon from './LicenseIcon';

interface LicenseViewProps {
    onBack: () => void;
    onClose?: () => void;
}

export default function LicenseView({ onBack, onClose }: LicenseViewProps) {
    const { isDarkMode } = useTheme();
    const [expandedLicense, setExpandedLicense] = useState<string | null>(null);
    const touchStartX = useRef<number | null>(null);

    const handleToggle = (name: string) => {
        const isOpening = expandedLicense !== name;
        setExpandedLicense(prev => prev === name ? null : name);

        if (isOpening) {
            setTimeout(() => {
                const element = document.getElementById(`license-${name}`);
                if (element) {
                    element.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }, 100);
        }
    };

    // Swipe Back Logic
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX.current === null) return;

        const touchEndX = e.changedTouches[0].clientX;
        const deltaX = touchEndX - touchStartX.current;

        // If swiped right more than 50px, go back
        if (deltaX > 50) {
            onBack();
        }
        touchStartX.current = null;
    };

    return (
        <div
            className="flex flex-col h-full"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6 shrink-0">
                <div className="flex items-center gap-2">
                    <button
                        onClick={onBack}
                        className={`p-2 -ml-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'}`}
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <h2 className="text-lg font-bold">오픈소스 라이선스</h2>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className={`p-2 -mr-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'}`}
                    >
                        <X size={24} />
                    </button>
                )}
            </div>

            {/* License List */}
            <div className="flex-1 overflow-y-auto -mx-6 px-6 pb-20 space-y-4">
                {licenses.map((license) => (
                    <div
                        key={license.name}
                        id={`license-${license.name}`}
                        className={`
                            rounded-xl overflow-hidden transition-all duration-300 border
                            ${isDarkMode
                                ? 'bg-slate-700/30 border-slate-700'
                                : 'bg-gray-50 border-gray-100'}
                        `}
                        style={{ scrollMarginTop: '20px' }}
                    >
                        <button
                            onClick={() => handleToggle(license.name)}
                            className="w-full flex items-center justify-between p-4 text-left"
                        >
                            <div className="flex items-center gap-3">
                                <LicenseIcon name={license.name} />
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-bold">{license.name}</span>
                                        <span className={`
                                            text-[10px] px-1.5 py-0.5 rounded font-medium
                                            ${isDarkMode ? 'bg-slate-600 text-slate-300' : 'bg-gray-200 text-gray-600'}
                                        `}>
                                            {license.licenseType}
                                        </span>
                                    </div>
                                    <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                                        {license.version} • {license.author}
                                    </div>
                                </div>
                            </div>
                            {expandedLicense === license.name ? (
                                <ChevronUp size={20} className="opacity-50" />
                            ) : (
                                <ChevronDown size={20} className="opacity-50" />
                            )}
                        </button>

                        {/* Accordion Content */}
                        <div
                            className={`
                                overflow-hidden transition-all duration-300 ease-in-out
                                ${expandedLicense === license.name ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}
                            `}
                        >
                            <div className={`
                                p-4 pt-0 text-[10px] font-mono leading-relaxed overflow-x-auto
                                ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}
                            `}>
                                <pre className="whitespace-pre-wrap font-mono">
                                    {license.fullText}
                                </pre>
                            </div>
                        </div>
                    </div>
                ))}

                <div className={`text-center text-xs py-8 ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>
                    This application uses open source software.
                    <br />
                    We are grateful to the authors and contributors.
                </div>
            </div>
        </div>
    );
}
