import { AlertCircle, RefreshCw } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ErrorStateProps {
    onRetry: () => void;
}

export default function ErrorState({ onRetry }: ErrorStateProps) {
    const { isDarkMode } = useTheme();

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center animate-in fade-in zoom-in duration-300">
            <div className={`p-4 rounded-full mb-4 shadow-sm ${isDarkMode ? 'bg-red-900/30' : 'bg-red-100'}`}>
                <AlertCircle className={`w-12 h-12 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`} />
            </div>
            <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                데이터를 불러오지 못했습니다
            </h3>
            <p className={`mb-8 max-w-xs leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                일시적인 오류일 수 있습니다.<br />잠시 후 다시 시도해주세요.
            </p>
            <button
                onClick={onRetry}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl font-medium transition-all flex items-center gap-2 shadow-lg shadow-blue-600/20"
            >
                <RefreshCw className="w-5 h-5" />
                다시 시도하기
            </button>
        </div>
    );
}
