import { Mail, Clock, AlertCircle, ChevronLeft, X, Send, HelpCircle, FileText, Shield, ExternalLink, Lightbulb, Bug, MessageSquare } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ContactViewProps {
    onBack?: () => void;
    onClose?: () => void;
}

export default function ContactView({ onBack, onClose }: ContactViewProps) {
    const { isDarkMode } = useTheme();

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
                    <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Contact Us</h2>
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
                <div className="px-6 py-8">
                    {/* Header Section */}
                    <div className="text-center mb-10">
                        <div className={`inline-flex items-center justify-center p-3 rounded-full mb-4 ${isDarkMode ? 'bg-slate-800' : 'bg-blue-50'}`}>
                            <HelpCircle className="text-blue-500" size={32} />
                        </div>
                        <h1 className="text-2xl font-bold mb-3">고객 지원 센터</h1>
                        <p className={`text-base leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                            Pilot Watcher 팀이 도와드릴게요.<br />
                            불편사항이나 개선 제안이 있다면<br />
                            언제든 편하게 말씀해 주세요.
                        </p>
                    </div>

                    {/* Inquiry Types */}
                    <div className={`mb-8 p-5 rounded-2xl ${isDarkMode ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                        <h3 className={`text-sm font-bold mb-3 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                            이런 내용을 보내주세요
                        </h3>
                        <ul className={`space-y-3 text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                            <li className="flex items-center gap-2.5">
                                <Lightbulb size={16} className="text-yellow-500 shrink-0" />
                                기능 개선 아이디어
                            </li>
                            <li className="flex items-center gap-2.5">
                                <Bug size={16} className="text-red-500 shrink-0" />
                                오류 신고 및 데이터 불일치 제보
                            </li>
                            <li className="flex items-center gap-2.5">
                                <MessageSquare size={16} className="text-green-500 shrink-0" />
                                기타 사용 문의 및 피드백
                            </li>
                        </ul>
                    </div>

                    {/* CTA Button */}
                    <a
                        href="mailto:sdj7072@gmail.com"
                        className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] mb-8"
                    >
                        <Mail size={20} />
                        문의 이메일 보내기
                    </a>

                    {/* Tips */}
                    <div className="mb-8 text-center">
                        <p className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>
                            더 빠른 확인을 위해 <span className="font-bold">앱 버전 · 사용 기기 · 스크린샷</span>을<br />
                            함께 보내주세요.
                        </p>
                    </div>

                    {/* Info Card (Hours & Delay) */}
                    <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-slate-800/30 border-slate-700' : 'bg-white border-gray-100 shadow-sm'}`}>
                        <div className="flex items-start gap-3 mb-4">
                            <Clock className="text-blue-500 shrink-0 mt-0.5" size={18} />
                            <div>
                                <h4 className={`text-sm font-bold mb-1 ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>상담 가능 시간</h4>
                                <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                                    평일 09:00 ~ 18:00<br />
                                    (주말 및 공휴일 휴무)
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <AlertCircle className="text-orange-500 shrink-0 mt-0.5" size={18} />
                            <div>
                                <h4 className={`text-sm font-bold mb-1 ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>응답 지연 안내</h4>
                                <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                                    문의량이 많을 경우 답변이 다소 지연될 수 있습니다.<br />
                                    최대한 빠르게 답변 드리도록 노력하겠습니다.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer Links */}
                    <div className={`mt-12 pt-8 border-t flex items-center justify-center gap-6 ${isDarkMode ? 'border-slate-800' : 'border-gray-100'}`}>
                        <button
                            onClick={() => window.open('https://pilot-watcher.pages.dev/privacy', '_system')}
                            className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${isDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            개인정보 처리방침
                        </button>
                        <div className={`w-px h-3 ${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'}`}></div>
                        <button
                            onClick={() => window.open('https://pilot-watcher.pages.dev/terms', '_system')}
                            className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${isDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            서비스 이용약관
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
