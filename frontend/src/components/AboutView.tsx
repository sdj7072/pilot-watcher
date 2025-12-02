import { ChevronLeft, X, Ship, Map, CheckCircle2, Download, Eye, Info, Layers, ExternalLink, Sparkles, Zap, Smartphone, Anchor } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import AppIcon from '../assets/icon.png';
import Screen1 from '../assets/screenshots/screen1.png';
import Screen2 from '../assets/screenshots/screen2.png';
import Screen3 from '../assets/screenshots/screen3.png';
import Screen4 from '../assets/screenshots/screen4.png';
import Screen5 from '../assets/screenshots/screen5.png';

interface AboutViewProps {
    onBack?: () => void;
    onClose?: () => void;
}

export default function AboutView({ onBack, onClose }: AboutViewProps) {
    const { isDarkMode } = useTheme();

    const screenshots = [Screen1, Screen2, Screen3, Screen4, Screen5];

    const usps = [
        {
            icon: <Anchor className="text-blue-500" size={24} />,
            title: "평택·당진항 맞춤형",
            description: "항만 종사자 니즈에 최적화"
        },
        {
            icon: <Zap className="text-yellow-500" size={24} />,
            title: "빠르고 가벼운 앱",
            description: "웹보다 즉각적인 응답 속도"
        },
        {
            icon: <Smartphone className="text-purple-500" size={24} />,
            title: "실무자 중심 UI",
            description: "현장에서 쓰기 쉬운 구성"
        },
        {
            icon: <CheckCircle2 className="text-green-500" size={24} />,
            title: "신뢰 기반 데이터",
            description: "공식 데이터 연동으로 정확성 강화"
        }
    ];

    const features = [
        "실시간 도선 계획 및 실시 정보 조회",
        "예선·강취·선석 정보 제공",
        "일출·일몰 및 항만 기상 정보",
        "선박 상세정보 링크 제공",
        "오늘/내일/주요 일정 캐치 뷰"
    ];

    return (
        <div className={`flex flex-col h-full bg-inherit ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6 shrink-0 p-6 pb-0">
                <div className="flex items-center gap-2">
                    {onBack && (
                        <button
                            onClick={onBack}
                            className={`p-2 -ml-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'}`}
                        >
                            <ChevronLeft size={24} className={isDarkMode ? 'text-white' : 'text-gray-900'} />
                        </button>
                    )}
                    <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>About App</h2>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className={`p-2 -mr-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'}`}
                    >
                        <X size={24} className={isDarkMode ? 'text-white' : 'text-gray-900'} />
                    </button>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
                {/* Hero Section */}
                <div className="flex flex-col items-center text-center px-6 pt-8 pb-12">
                    <div className="w-28 h-28 rounded-[2rem] shadow-2xl overflow-hidden mb-8 animate-fade-in">
                        <img src={AppIcon} alt="Pilot Watcher" className="w-full h-full object-cover" />
                    </div>
                    <h1 className="text-3xl font-extrabold mb-3 tracking-tight">Pilot Watcher</h1>
                    <p className={`text-lg font-medium mb-8 max-w-xs leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                        평택·당진항 도선 예보 현황을<br />언제 어디서나 한눈에
                    </p>

                    {/* App Store Badge (Coming Soon) */}
                    <div className={`
                        flex items-center gap-3 px-5 py-2.5 rounded-xl transition-all cursor-not-allowed opacity-90 shadow-lg
                        bg-black text-white border border-white/10
                    `}>
                        <svg viewBox="0 0 384 512" width="24" height="24" fill="currentColor">
                            <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 52.3-11.4 69.5-34.3z" />
                        </svg>
                        <div className="text-left">
                            <div className="text-[10px] font-medium uppercase tracking-wider text-gray-300">
                                Coming Soon on the
                            </div>
                            <div className="text-lg font-bold leading-none mt-0.5">
                                App Store
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="mb-10">
                    <div className="flex items-center gap-2 mb-4 px-1">
                        <Info className="text-blue-500" size={20} />
                        <h3 className={`text-lg font-bold ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>서비스 소개</h3>
                    </div>
                    <div className={`p-5 rounded-2xl leading-relaxed text-base ${isDarkMode ? 'bg-slate-700/50 text-slate-300' : 'bg-gray-50 text-gray-600'}`}>
                        평택·당진항 도선 예보 현황을 실시간으로 제공하는 앱입니다. 도선 계획 및 실시 현황 등 도선에 필요한 핵심 정보를 한눈에 파악할 수 있습니다.
                    </div>
                </div>

                {/* Why Pilot Watcher? (USP) */}
                <div className="px-6 py-6">
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center gap-2 mb-3">
                            <Sparkles className="text-yellow-500" size={24} />
                            <h3 className="text-2xl font-bold">왜 Pilot Watcher인가요?</h3>
                        </div>
                        <p className={`text-base ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                            현장의 목소리를 담아 꼭 필요한 기능만 담았습니다.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {usps.map((usp, index) => (
                            <div key={index} className={`flex items-center gap-4 p-4 rounded-2xl ${isDarkMode ? 'bg-slate-800/50' : 'bg-white border border-gray-100 shadow-sm'}`}>
                                <div className={`p-3 rounded-xl shrink-0 ${isDarkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                                    {usp.icon}
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg mb-0.5">{usp.title}</h4>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                                        {usp.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Key Features */}
                <div className="px-6 py-6">
                    <div className="flex items-center gap-2 mb-6">
                        <Layers className="text-purple-500" size={24} />
                        <h3 className="text-xl font-bold">주요 기능</h3>
                    </div>
                    <div className={`p-6 rounded-2xl ${isDarkMode ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                        <ul className="space-y-4">
                            {features.map((feature, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <CheckCircle2 className="text-blue-500 shrink-0 mt-0.5" size={18} />
                                    <span className={`text-base font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                                        {feature}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Screenshots Carousel */}
                <div className={`py-12 ${isDarkMode ? 'bg-slate-800/30' : 'bg-gray-50/50'}`}>
                    <div className="px-6 mb-6 flex items-center gap-2">
                        <Eye className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} size={24} />
                        <div>
                            <h3 className="text-xl font-bold">미리보기</h3>
                        </div>
                    </div>
                    <div className="flex overflow-x-auto px-6 gap-4 pb-8 snap-x snap-mandatory scrollbar-hide">
                        {screenshots.map((src, index) => (
                            <div key={index} className="flex-none w-48 snap-center">
                                <img
                                    src={src}
                                    alt={`Screenshot ${index + 1}`}
                                    className="w-full rounded-xl shadow-lg border border-black/5"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Trust Indicators */}
                <div className="px-6 pb-12">
                    <div className={`p-6 rounded-2xl ${isDarkMode ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="text-green-500 shrink-0 mt-0.5" size={20} />
                            <div>
                                <h4 className="font-bold text-lg mb-1">신뢰할 수 있는 데이터</h4>
                                <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                                    <a
                                        href="http://ptpilot.co.kr"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:underline inline-flex items-center gap-0.5"
                                    >
                                        평택·당진 도선사회<ExternalLink size={12} />
                                    </a>
                                    의 공식 데이터를 기반으로 제공되며, 실시간으로 업데이트됩니다.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className={`py-12 text-center border-t ${isDarkMode ? 'border-slate-800' : 'border-gray-100'}`}>
                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 ${isDarkMode ? 'bg-slate-800' : 'bg-gray-100'}`}>
                        <span className={`text-[10px] font-bold tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>Designed & Developed by</span>
                        <span className={`text-xs font-black bg-gradient-to-r ${isDarkMode ? 'from-white to-slate-400' : 'from-gray-900 to-gray-600'} bg-clip-text text-transparent`}>
                            SEO DEOK JAE
                        </span>
                    </div>

                    <div className="flex justify-center mb-8">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wide ${isDarkMode ? 'bg-slate-800 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                            <span>Co-developed with</span>
                            <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Gemini</span>
                        </div>
                    </div>

                    <p className={`text-[10px] font-bold ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>
                        © 2025 MADO. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}
