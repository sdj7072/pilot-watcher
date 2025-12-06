import { useState, useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

// Warning keywords that trigger critical (red) status
// Stored without spaces - matching will allow optional spaces between any characters
const CRITICAL_KEYWORDS = [
    '기상악화',
    '풍랑도선',
    '부분운항',
    '지연운항',
    '차량탑재제한',
    '단독운항',
];

/**
 * Create a regex pattern that matches a keyword with optional whitespace between characters.
 * e.g., "기상악화" -> "기\s*상\s*악\s*화"
 */
function createFlexiblePattern(keyword: string): string {
    return keyword.split('').join('\\s*');
}

/**
 * Check if text contains a keyword (with flexible spacing).
 */
function containsKeyword(text: string, keyword: string): boolean {
    const pattern = createFlexiblePattern(keyword);
    return new RegExp(pattern).test(text);
}

export type NoticeSeverity = 'none' | 'warning' | 'critical';

/**
 * Determine the severity of notices.
 * - 'none': No notices
 * - 'warning': Has notices but no critical keywords
 * - 'critical': Has notices with critical keywords
 */
export function getNoticeSeverity(notices: string[]): NoticeSeverity {
    if (notices.length === 0) return 'none';

    const hasCritical = notices.some(notice =>
        CRITICAL_KEYWORDS.some(keyword => containsKeyword(notice, keyword))
    );

    return hasCritical ? 'critical' : 'warning';
}

/**
 * Highlight critical keywords in a notice string.
 * Returns JSX with highlighted keywords.
 * Matches keywords with flexible spacing (e.g., "기상 악화" matches "기상악화").
 */
function highlightKeywords(text: string): React.ReactNode {
    // Create regex pattern from all keywords with flexible spacing
    const patterns = CRITICAL_KEYWORDS.map(k => createFlexiblePattern(k));
    const combinedPattern = patterns.join('|');
    const regex = new RegExp(`(${combinedPattern})`, 'g');

    const parts = text.split(regex);

    return parts.map((part, index) => {
        // Check if this part matches any keyword pattern
        const isMatch = CRITICAL_KEYWORDS.some(keyword => containsKeyword(part, keyword));
        if (isMatch) {
            return (
                <span key={index} className="text-red-500 font-bold">
                    {part}
                </span>
            );
        }
        return part;
    });
}

interface AnnouncementModalProps {
    isOpen: boolean;
    onClose: () => void;
    notices: string[];
}

export default function AnnouncementModal({ isOpen, onClose, notices }: AnnouncementModalProps) {
    const { isDarkMode } = useTheme();
    const [isVisible, setIsVisible] = useState(false);
    const severity = getNoticeSeverity(notices);

    useEffect(() => {
        if (isOpen) {
            // Small delay for animation
            const timer = setTimeout(() => setIsVisible(true), 10);
            return () => clearTimeout(timer);
        } else {
            // Use setTimeout to avoid direct setState in effect
            const timer = setTimeout(() => setIsVisible(false), 0);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const headerIconColor = severity === 'critical' ? 'text-red-500' : severity === 'warning' ? 'text-amber-500' : 'text-gray-400';

    return (
        <div
            className={`fixed inset-0 z-[200] flex items-center justify-center p-4 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

            {/* Modal Content */}
            <div
                className={`relative w-full max-w-md rounded-2xl shadow-2xl transform transition-all duration-300 ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'} ${isDarkMode ? 'bg-[#1e293b] text-white' : 'bg-white text-gray-900'}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className={`flex items-center justify-between p-4 border-b ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
                    <div className="flex items-center gap-2">
                        <AlertTriangle size={20} className={headerIconColor} />
                        <h2 className="text-lg font-bold">Notice</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 max-h-[60vh] overflow-y-auto">
                    {notices.length > 0 ? (
                        <ul className="space-y-3">
                            {notices.map((notice, index) => (
                                <li
                                    key={index}
                                    className={`p-3 rounded-xl text-sm leading-relaxed flex gap-2 ${isDarkMode ? 'bg-white/5 border border-white/10' : 'bg-blue-50 border border-blue-100'}`}
                                >
                                    <span className="text-amber-500 font-bold">•</span>
                                    <span>{highlightKeywords(notice)}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            등록된 공지사항이 없습니다.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

/**
 * Extract notice items from pilots array.
 * The pilots array contains items like:
 * ["당직도선사","1대기","2대기","3대기","4대기","비고","*notice1...","notice2...","WG,GU",...]
 * Notices appear after "비고" and are identified by starting with "*" or containing specific patterns.
 * Content starting with "*" will be split into separate lines.
 */
export function extractNotices(pilots: string[]): string[] {
    const notices: string[] = [];
    let foundBigo = false;

    for (const item of pilots) {
        if (item === '비고') {
            foundBigo = true;
            continue;
        }

        if (foundBigo) {
            // Stop when we hit actual pilot names (short 2-letter codes or names without special chars)
            if (item.length <= 3 || item.match(/^[A-Z]{2}(,[A-Z]{2})*$/)) {
                break;
            } else if (item === '당직도선사') {
                foundBigo = false;
            } else {
                // If item contains '*', split it
                if (item.includes('*')) {
                    const parts = item.split('*')
                        .map(s => s.trim())
                        .filter(s => s.length > 0)
                        .map(s => s.replace(/\.$/, '')); // Remove trailing dot
                    notices.push(...parts);
                } else {
                    notices.push(item.replace(/\.$/, '')); // Remove trailing dot
                }
            }
        }
    }

    return notices;
}
