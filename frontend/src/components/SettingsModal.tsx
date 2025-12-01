import { X, ChevronRight, Shield, Mail, Info, FileText } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
    const { isDarkMode } = useTheme();

    if (!isOpen) return null;

    const menuItems = [
        {
            icon: <Shield size={20} />,
            label: '개인정보 처리방침',
            onClick: () => window.open('https://www.privacy.go.kr', '_blank'), // TODO: Replace with actual link
        },
        {
            icon: <Mail size={20} />,
            label: '문의하기',
            onClick: () => window.location.href = 'mailto:support@pilotwatcher.com',
        },
        {
            icon: <FileText size={20} />,
            label: '오픈소스 라이선스',
            onClick: () => alert('오픈소스 라이선스 정보 준비 중'), // TODO: Implement license page
        },
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className={`
                relative w-full max-w-md rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl 
                transform transition-all animate-in slide-in-from-bottom duration-300
                ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-gray-900'}
            `}>
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">Settings</h2>
                    <button
                        onClick={onClose}
                        className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'}`}
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Menu List */}
                <div className="space-y-2">
                    {menuItems.map((item, index) => (
                        <button
                            key={index}
                            onClick={item.onClick}
                            className={`
                                w-full flex items-center justify-between p-4 rounded-xl transition-all
                                ${isDarkMode
                                    ? 'bg-slate-700/50 hover:bg-slate-700 active:bg-slate-600'
                                    : 'bg-gray-50 hover:bg-gray-100 active:bg-gray-200'}
                            `}
                        >
                            <div className="flex items-center gap-3">
                                <span className={`${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                                    {item.icon}
                                </span>
                                <span className="font-medium">{item.label}</span>
                            </div>
                            <ChevronRight size={18} className="opacity-50" />
                        </button>
                    ))}
                </div>

                {/* App Info Footer */}
                <div className="mt-8 text-center">
                    <div className={`flex items-center justify-center gap-2 text-sm ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>
                        <Info size={14} />
                        <span>Version 4.0.0</span>
                    </div>
                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-600' : 'text-gray-300'}`}>
                        © 2025 Pilot Watcher
                    </p>
                </div>
            </div>
        </div>
    );
}
