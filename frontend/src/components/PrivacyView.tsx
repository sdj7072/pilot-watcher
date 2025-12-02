import { X, Megaphone, CalendarCheck, ChevronLeft, User, Mail } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface PrivacyViewProps {
    onBack?: () => void;
    onClose?: () => void;
}

export default function PrivacyView({ onBack, onClose }: PrivacyViewProps) {
    const { isDarkMode } = useTheme();

    return (
        <div className={`flex flex-col h-full bg-inherit ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6 shrink-0">
                <div className="flex items-center gap-2">
                    {onBack && (
                        <button
                            onClick={onBack}
                            className={`p-2 -ml-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'}`}
                        >
                            <ChevronLeft size={24} className={isDarkMode ? 'text-white' : 'text-gray-900'} />
                        </button>
                    )}
                    <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Privacy Policy</h2>
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
            <div className={`flex-1 overflow-y-auto -mx-6 px-6 pb-20 space-y-8 text-sm leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>

                {/* Dates Box */}
                <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-slate-700/50 border-slate-700' : 'bg-gray-50 border-gray-100'}`}>
                    <div className="flex flex-col gap-3 text-xs opacity-90">
                        <div className="flex items-center gap-2.5">
                            <Megaphone size={14} className={`shrink-0 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                            <div className="flex gap-2">
                                <span className="font-semibold shrink-0">공고일자 :</span>
                                <span>2025년 12월 2일(화요일)</span>
                            </div>
                        </div>

                        <div className={`h-px w-full ${isDarkMode ? 'bg-slate-600' : 'bg-gray-200'}`} />

                        <div className="flex items-center gap-2.5">
                            <CalendarCheck size={14} className={`shrink-0 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                            <div className="flex gap-2">
                                <span className="font-semibold shrink-0">시행일자 :</span>
                                <span>2025년 12월 2일(화요일)</span>
                            </div>
                        </div>
                    </div>
                </div>

                <section>
                    <h3 className={`text-base font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>1. 개인정보의 처리 목적</h3>
                    <p className="mb-2">
                        Pilot Watcher(이하 '서비스')는 다음 목적에 따라 최소한의 개인정보만을 처리합니다.
                    </p>
                    <ul className="list-disc pl-5 space-y-1 marker:text-blue-500">
                        <li>도선 현황 및 예보 정보 제공</li>
                        <li>서비스 이용 중 발생하는 문의·오류·불편 사항 대응</li>
                    </ul>
                    <p className="mt-2 text-xs opacity-80">
                        수집된 정보는 명시된 목적 외로 사용되지 않습니다.
                    </p>
                </section>

                <section>
                    <h3 className={`text-base font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>2. 처리하는 개인정보 항목</h3>
                    <p className="mb-2">
                        서비스는 회원가입 없이 이용 가능하며, 다음 정보가 자동으로 생성·수집될 수 있습니다.
                    </p>
                    <ul className="list-disc pl-5 space-y-1 marker:text-blue-500">
                        <li>기기 정보(모델명, OS 버전, 기기 식별자 등)</li>
                        <li>접속 로그, 이용 기록, 오류 로그</li>
                        <li>쿠키 및 기타 분석용 식별자</li>
                    </ul>
                </section>

                <section>
                    <h3 className={`text-base font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>3. 개인정보의 제3자 제공</h3>
                    <p>
                        운영자는 법령 근거 또는 이용자 동의 없이 개인정보를 제3자에게 제공하지 않습니다.
                    </p>
                </section>

                <section>
                    <h3 className={`text-base font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>4. 개인정보의 파기</h3>
                    <p>
                        개인정보 보유기간 경과 또는 처리 목적 달성 시 지체 없이 파기합니다.
                        법령상 보관 의무가 있는 경우 해당 기간 동안 안전하게 보관 후 파기합니다.
                    </p>
                </section>

                <section>
                    <h3 className={`text-base font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>5. 개인정보 보호책임자</h3>
                    <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-slate-700/50 border-slate-700' : 'bg-gray-50 border-gray-100'}`}>
                        <div className="flex flex-col gap-3 text-xs opacity-90">
                            <div className="flex items-center gap-2.5">
                                <User size={14} className={`shrink-0 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                                <div className="flex gap-2">
                                    <span className="font-semibold shrink-0 w-20">개발자·운영자</span>
                                    <span>SEO DEOK JAE</span>
                                </div>
                            </div>

                            <div className={`h-px w-full ${isDarkMode ? 'bg-slate-600' : 'bg-gray-200'}`} />

                            <div className="flex items-center gap-2.5">
                                <Mail size={14} className={`shrink-0 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`} />
                                <div className="flex gap-2">
                                    <span className="font-semibold shrink-0 w-20">이메일</span>
                                    <a href="mailto:sdj7072@gmail.com?subject=%5BPilot%20Watcher%5D%20%EB%AC%B8%EC%9D%98%ED%95%98%EA%B8%B0" className={`transition-colors ${isDarkMode ? 'text-blue-400' : 'hover:text-blue-500'}`}>sdj7072@gmail.com</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="text-xs text-center pt-4 pb-4 opacity-60">
                    본 개인정보처리방침은 운영정책에 따라 변경될 수 있으며,<br />변경 시 서비스 내 공지를 통해 안내합니다.
                </div>
            </div>
        </div>
    );
}
