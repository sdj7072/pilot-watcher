import { X, ChevronRight, Shield, Mail, Info, FileText, Settings, ChevronDown } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useState, useEffect, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import LicenseView from './LicenseView';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
    const { isDarkMode } = useTheme();
    const [currentView, setCurrentView] = useState<'main' | 'licenses'>('main');
    const [isVisible, setIsVisible] = useState(isOpen);
    const touchStartY = useRef<number | null>(null);

    useEffect(() => {
        if (isOpen) {
            // eslint-disable-next-line
            setIsVisible(true);
            document.body.style.overflow = 'hidden';
            setCurrentView('main'); // Reset view on open
        } else {
            const timer = setTimeout(() => {
                setIsVisible(false);
                document.body.style.overflow = '';
            }, 750);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isOpen && !isVisible) return null;

    const isClosing = !isOpen && isVisible;

    const handleClose = () => {
        onClose();
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartY.current === null) return;

        const touchEndY = e.changedTouches[0].clientY;
        const deltaY = touchEndY - touchStartY.current;

        // If swiped down more than 50px, close modal
        if (deltaY > 50 && currentView === 'main') {
            handleClose();
        }
        touchStartY.current = null;
    };

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
            onClick: () => setCurrentView('licenses'),
        },
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center">
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}
                onClick={handleClose}
            />

            {/* Modal Content */}
            <div
                className={`
                    relative w-full max-w-md rounded-t-2xl sm:rounded-2xl p-6 pb-[6.5rem] shadow-2xl overflow-hidden
                    transform transition-all ${isClosing ? 'animate-slide-down' : 'animate-slide-up'}
                    ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-gray-900'}
                `}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                style={{ height: '80vh', maxHeight: '600px' }}
            >
                {/* Swipe Indicator (Native Only) */}
                {Capacitor.isNativePlatform() && (
                    <div className="flex justify-center -mt-2 mb-2">
                        <ChevronDown className={`opacity-50 ${isDarkMode ? 'text-slate-400' : 'text-gray-400'}`} />
                    </div>
                )}

                {/* Main View */}
                <div
                    className={`
                        absolute inset-0 p-6 pb-[6.5rem] transition-transform duration-300 ease-in-out
                        ${currentView === 'main' ? 'translate-x-0' : '-translate-x-full'}
                    `}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <Settings size={20} className={isDarkMode ? 'text-slate-400' : 'text-gray-500'} />
                            <h2 className="text-lg font-bold">Settings</h2>
                        </div>
                        <button
                            onClick={handleClose}
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
                        <div className={`flex items-center justify-center gap-2 text-sm font-medium ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>
                            <Info size={14} />
                            <span>Version 4.0.0</span>
                            <span className="mx-1 opacity-50">|</span>
                            <span>© 2025 MADO</span>
                        </div>
                    </div>
                </div>

                {/* License View */}
                <div
                    className={`
                        absolute inset-0 p-6 pb-[6.5rem] transition-transform duration-300 ease-in-out bg-inherit
                        ${currentView === 'licenses' ? 'translate-x-0' : 'translate-x-full'}
                    `}
                >
                    <LicenseView onBack={() => setCurrentView('main')} />
                </div>
            </div>
        </div>
    );
}
