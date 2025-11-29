import React from 'react';

interface CircularTimerProps {
    timeLeft: number;
    maxTime?: number;
    size?: number;
    strokeWidth?: number;
    children?: React.ReactNode;
    className?: string;
}

export default function CircularTimer({
    timeLeft,
    maxTime = 60,
    size = 40,
    strokeWidth = 3,
    children,
    className = ''
}: CircularTimerProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const progress = Math.max(0, Math.min(timeLeft / maxTime, 1));
    const dashOffset = circumference - progress * circumference;

    return (
        <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
            {/* Background Circle */}
            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                className="absolute top-0 left-0 rotate-90 scale-x-[-1] origin-center transform"
            >
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    className="opacity-20"
                />
                {/* Progress Circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={dashOffset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-linear"
                />
            </svg>
            {/* Inner Content */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}
