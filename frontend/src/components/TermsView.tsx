import { ChevronLeft, X, Megaphone, CalendarCheck } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface TermsViewProps {
    onBack: () => void;
    onClose?: () => void;
}

export default function TermsView({ onBack, onClose }: TermsViewProps) {
    const { isDarkMode } = useTheme();

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 shrink-0">
                <div className="flex items-center gap-2">
                    <button
                        onClick={onBack}
                        className={`p-2 -ml-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'}`}
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <h2 className="text-lg font-bold">Terms of Service</h2>
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

            {/* Content */}
            <div className={`flex-1 overflow-y-auto -mx-6 px-6 pb-20 space-y-8 text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>

                {/* Dates Box */}
                <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-slate-700/30 border-slate-700' : 'bg-gray-50 border-gray-100'}`}>
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
                    <h3 className={`text-base font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>제1조 (목적)</h3>
                    <p>
                        본 약관은 개인 개발자인 운영자(이하 '운영자')가 제공하는 Pilot Watcher 서비스(이하 '서비스')의 이용 조건과 절차, 운영자와 이용자 간의 권리·의무를 규정함을 목적으로 합니다.
                    </p>
                </section>

                <section>
                    <h3 className={`text-base font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>제2조 (서비스 내용)</h3>
                    <p className="mb-2">운영자는 이용자에게 다음과 같은 서비스를 제공합니다.</p>
                    <ol className="list-decimal pl-5 space-y-1 marker:font-medium">
                        <li>평택·당진항 도선 현황 및 예보 정보 조회</li>
                        <li>기타 운영자가 개발하여 제공하는 기능</li>
                    </ol>
                </section>

                <section>
                    <h3 className={`text-base font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>제3조 (정보 출처 표시)</h3>
                    <p className="mb-2">
                        본 서비스에서 제공하는 도선 정보는 다음의 공개된 온라인 자료를 기반으로 합니다.
                    </p>
                    <ul className="list-disc pl-5 mb-3 space-y-1 marker:text-blue-500">
                        <li>
                            <a href="http://ptpilot.co.kr/" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline decoration-1 underline-offset-2">평택ㆍ당진 도선사회(http://ptpilot.co.kr/)</a> 에 공개된 도선 관련 정보
                        </li>
                    </ul>
                    <p className="text-xs opacity-80">
                        운영자는 해당 사이트의 데이터를 직접 저장·보증하지 않으며, 공개된 정보를 단순 정리·표시하는 형태로 제공합니다. 이 정보는 참고용이며 실제 항만 운영 정보와 상이할 수 있습니다.
                    </p>
                </section>

                <section>
                    <h3 className={`text-base font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>제4조 (면책조항)</h3>
                    <ol className="list-decimal pl-5 space-y-1 marker:font-medium">
                        <li>서비스에서 제공하는 데이터는 참고용이며, 정보의 정확성·적시성·완전성을 보장하지 않습니다.</li>
                        <li>본 서비스 이용으로 인해 발생하는 모든 결과는 이용자의 판단과 책임에 따릅니다.</li>
                        <li>실제 업무, 운항 판단 등 중요 의사결정 시 반드시 공식 기관 정보를 확인해야 합니다.</li>
                    </ol>
                </section>

                <section>
                    <h3 className={`text-base font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>제5조 (서비스 변경 및 중단)</h3>
                    <ol className="list-decimal pl-5 space-y-1 marker:font-medium">
                        <li>운영자는 서비스 운영 또는 유지·관리의 필요에 따라 일부 또는 전체 서비스를 변경하거나 중단할 수 있습니다.</li>
                        <li>변경 사항은 서비스 화면 또는 공지를 통해 사전 또는 사후 안내할 수 있습니다.</li>
                    </ol>
                </section>

                <section>
                    <h3 className={`text-base font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>제6조 (지적재산권)</h3>
                    <p>
                        서비스 내 콘텐츠, UI, 코드, 디자인 등은 운영자 또는 해당 권리자에게 귀속됩니다. 이용자는 이를 무단 복제, 배포, 수정할 수 없습니다.
                    </p>
                </section>

                <section>
                    <h3 className={`text-base font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>제7조 (이용자의 의무)</h3>
                    <ol className="list-decimal pl-5 space-y-1 marker:font-medium">
                        <li>이용자는 관련 법령, 약관, 서비스 이용 안내를 준수해야 합니다.</li>
                        <li>서비스의 정상적인 운영을 방해하는 행위를 해서는 안 됩니다.</li>
                    </ol>
                </section>

                <section>
                    <h3 className={`text-base font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>제8조 (준거법 및 분쟁 해결)</h3>
                    <ol className="list-decimal pl-5 space-y-1 marker:font-medium">
                        <li>본 약관은 대한민국 법률에 따라 해석됩니다.</li>
                        <li>분쟁 발생 시 운영자와 이용자는 상호 협의를 통해 해결하도록 노력합니다.</li>
                        <li>협의가 어려울 경우 대한민국 법령이 정한 절차에 따릅니다.</li>
                    </ol>
                </section>

                <section>
                    <h3 className={`text-base font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>운영자 정보</h3>
                    <div className={`p-4 rounded-xl space-y-2 ${isDarkMode ? 'bg-slate-700/50' : 'bg-gray-100'}`}>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold opacity-70 w-24">개발자·운영자</span>
                            <span className="font-medium">SEO DEOK JAE</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold opacity-70 w-24">이메일</span>
                            <a href="mailto:sdj7072@gmail.com?subject=%5BPilot%20Watcher%5D%20%EB%AC%B8%EC%9D%98%ED%95%98%EA%B8%B0" className="font-medium hover:text-blue-500 transition-colors">sdj7072@gmail.com</a>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
