import React from 'react';
import StatusBadge from './StatusBadge';
import { Ship } from '../types';
import { useTheme } from '../context/ThemeContext';

interface ShipCardProps {
  ship: Ship;
}

export default function ShipCard({ ship }: ShipCardProps) {
  const { isDarkMode } = useTheme();

  return (
    <div className={`rounded-xl p-4 shadow-sm border hover:shadow-md transition-shadow ${isDarkMode ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-gray-100'}`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex flex-col">
          <span className={`text-lg font-bold ${isDarkMode ? 'text-slate-100' : 'text-gray-800'}`}>{ship.time}</span>
          <span className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-400'}`}>{ship.date}</span>
        </div>
        <StatusBadge status={ship.status} />
      </div>

      <div className="mb-3">
        <h3 className={`text-base font-bold mb-1.5 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{ship.name}</h3>
        <div className="flex flex-wrap gap-1">
          {ship.sections && ship.sections.map((sec, i) => (
            <span key={i} className={`px-1.5 py-0.5 text-xs rounded ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-gray-100 text-gray-600'}`}>
              {sec}
            </span>
          ))}
          {ship.kind && (
            <span className="px-1.5 py-0.5 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs rounded border border-yellow-100 dark:border-yellow-800">
              {ship.kind}
            </span>
          )}
          {ship.side && (
            <span className="px-1.5 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded border border-blue-100 dark:border-blue-800">
              {ship.side}
            </span>
          )}
        </div>
      </div>

      <div className={`flex justify-between items-end text-sm border-t pt-3 mt-2 ${isDarkMode ? 'border-slate-800' : 'border-gray-50'}`}>
        <div className="flex flex-col gap-0.5">
          <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
            {ship.type}
            {ship.agency && (
              <span className={`truncate max-w-[80px] ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`} title={ship.agency}>
                {' '}| {ship.agency}
              </span>
            )}
          </span>
        </div>
        <div className={`font-bold px-2 py-1 rounded ${isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-50 text-blue-700'}`}>
          <span className={isDarkMode ? 'text-blue-400' : 'text-blue-600'}>{ship.pilot}</span>
        </div>
      </div>
    </div>
  );
}
