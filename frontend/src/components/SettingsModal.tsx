import { X, ChevronRight, Shield, Mail, Info, FileText, Settings, ChevronDown, ExternalLink, Code, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useState, useEffect, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import { ActionSheet, ActionSheetButtonStyle } from '@capacitor/action-sheet';
import LicenseView from './LicenseView';
import PrivacyView from './PrivacyView';
import TermsView from './TermsView';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
    const { isDarkMode } = useTheme();
    const [currentView, setCurrentView] = useState<'main' | 'licenses' | 'privacy' | 'terms'>('main');
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

    const handlePrivacy = async () => {
        if (!Capacitor.isNativePlatform()) {
            setCurrentView('privacy');
            return;
        }

        const result = await ActionSheet.showActions({
            title: 'Privacy Policy',
            options: [
                {
                    title: 'Open in Safari',
                },
                {
                    title: 'View in App',
                },
                {
                    title: 'Cancel',
                    style: ActionSheetButtonStyle.Cancel,
                },
            ],
        });

        if (result.index === 0) {
            // Open in external browser (Safari)
            window.open('https://pilot-watcher.pages.dev/privacy', '_system');
        } else if (result.index === 1) {
            setCurrentView('privacy');
        }
    };

    const handleTerms = async () => {
        if (!Capacitor.isNativePlatform()) {
            setCurrentView('terms');
            return;
        }

        const result = await ActionSheet.showActions({
            title: 'Terms of Service',
            options: [
                {
                    title: 'Open in Safari',
                },
                {
                    title: 'View in App',
                },
                {
                    title: 'Cancel',
                    style: ActionSheetButtonStyle.Cancel,
                },
            ],
        });

        if (result.index === 0) {
            // Open in external browser (Safari)
            window.open('https://pilot-watcher.pages.dev/terms', '_system');
        } else if (result.index === 1) {
            setCurrentView('terms');
        }
    };

    const menuItems = [
        {
            icon: <Sparkles size={20} className="text-blue-500" />,
            label: 'About',
            onClick: () => window.open('https://pilot-watcher.pages.dev/about', '_system'),
        },
        {
            icon: <Mail size={20} />,
            label: 'Contact Us',
            onClick: () => window.open('https://pilot-watcher.pages.dev/contact', '_system'),
        },
        {
            icon: <Shield size={20} />,
            label: 'Privacy Policy',
            onClick: handlePrivacy,
        },
        {
            icon: <FileText size={20} />,
            label: 'Terms of Service',
            onClick: handleTerms,
        },
        {
            icon: <Code size={20} />,
            label: 'Open Source Licenses',
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
                style={{ height: '90vh' }}
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

                    {/* Data Source Disclaimer */}
                    <div className={`mt-6 p-4 rounded-xl text-xs leading-relaxed ${isDarkMode ? 'bg-slate-700/30 text-slate-400' : 'bg-gray-50 text-gray-500'}`}>
                        <div className="flex items-center gap-2 mb-2 font-bold opacity-90">
                            <Info size={14} />
                            <span>정보 출처 안내</span>
                        </div>
                        <p className="mb-2">
                            본 앱에서 제공하는 도선 현황 및 예보 정보는 <a href="http://ptpilot.co.kr" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 underline decoration-1 underline-offset-2 hover:text-blue-500">평택·당진 도선사회<ExternalLink size={10} /></a>의 데이터를 기반으로 하여 사용자 편의를 위해 재가공한 것입니다.
                        </p>
                        <p>
                            표시된 정보는 실제 일정과 상이할 수 있으며, 중요 업무 결정 시에는 반드시 공식 정보를 확인하시기 바랍니다.
                        </p>
                    </div>

                    {/* App Info Footer */}
                    <div className="mt-6 text-center space-y-1">
                        <div className={`text-sm font-bold ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                            Version 4.0.0
                        </div>
                        <div className={`text-xs font-medium ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>
                            © 2025 MADO. All rights reserved.
                        </div>
                    </div>
                </div>

                {/* Sub Views */}
                <div
                    className={`
                        absolute inset-0 p-6 pb-[6.5rem] transition-transform duration-300 ease-in-out bg-inherit
                        ${currentView === 'licenses' ? 'translate-x-0' : 'translate-x-full'}
                    `}
                >
                    <LicenseView onBack={() => setCurrentView('main')} onClose={handleClose} />
                </div>

                <div
                    className={`
                        absolute inset-0 p-6 pb-[6.5rem] transition-transform duration-300 ease-in-out bg-inherit
                        ${currentView === 'privacy' ? 'translate-x-0' : 'translate-x-full'}
                    `}
                >
                    <PrivacyView onBack={() => setCurrentView('main')} onClose={handleClose} />
                </div>

                <div
                    className={`
                        absolute inset-0 p-6 pb-[6.5rem] transition-transform duration-300 ease-in-out bg-inherit
                        ${currentView === 'terms' ? 'translate-x-0' : 'translate-x-full'}
                    `}
                >
                    <TermsView onBack={() => setCurrentView('main')} onClose={handleClose} />
                </div>
            </div>
        </div>
    );
}
