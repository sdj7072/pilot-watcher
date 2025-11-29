import React, { useState } from 'react';
import StatusBadge from './StatusBadge';
import { Ship, ExternalLink, ChevronDown, ChevronUp, User, Anchor, Wind, Radio, Hash, Navigation, LogIn, LogOut, RefreshCw, ArrowUpCircle, AlertTriangle, Scale, Ruler, ArrowRight } from 'lucide-react';
import { Ship as ShipType } from '../types';
import { useTheme } from '../context/ThemeContext';
import { getPilotType } from '../utils/pilotUtils';

interface ShipCardProps {
  ship: ShipType;
}

export default function ShipCard({ ship }: ShipCardProps) {
  const { isDarkMode } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  const pilotType = getPilotType(ship.sections);

  return (
    <div className={`rounded-xl p-4 shadow-sm border hover:shadow-md transition-shadow ${isDarkMode ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-gray-100'}`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex flex-col">
          <span className={`text-sm font-bold ${isDarkMode ? 'text-slate-100' : 'text-gray-800'}`}>{ship.time}</span>
        </div>
        <StatusBadge status={ship.status} />
      </div>

      <div className="mb-3">
        <h3 className={`text-base font-bold mb-1.5 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          <a
            href={ship.link || `https://www.vesselfinder.com/vessels?name=${encodeURIComponent(ship.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline hover:text-blue-500 transition-colors flex items-center gap-1.5"
          >
            <Ship size={14} className={`${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`} />
            {ship.name}
            <ExternalLink size={12} className={`${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`} />
          </a>
        </h3>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1.5">
            <User size={14} className={`${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`} />
            <span className={`text-sm ${isDarkMode ? 'text-slate-200' : 'text-gray-900'}`}>
              {ship.pilot}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {pilotType && (
              <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${pilotType.color}`}>
                <pilotType.icon size={10} />
                {pilotType.type}
              </div>
            )}
            <div className="flex items-center gap-1">
              {ship.sections && ship.sections.map((sec, i) => {
                const isPilotStation = ['IPA', 'JANG'].some(station => sec.includes(station));
                return (
                  <React.Fragment key={i}>
                    {i > 0 && <ArrowRight size={12} className={`${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`} />}
                    <span className={`text-xs font-bold ${isPilotStation
                        ? 'text-red-600 dark:text-red-400'
                        : (isDarkMode ? 'text-slate-300' : 'text-gray-700')
                      }`}>
                      {sec}
                    </span>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className={`flex justify-between items-center text-sm border-t pt-3 mt-2 ${isDarkMode ? 'border-slate-800' : 'border-gray-50'}`}>
        <div className="flex flex-col gap-0.5">
          {ship.kind && (
            <div className="flex items-center gap-1.5 text-red-500 font-bold">
              <AlertTriangle size={14} className="text-red-500" />
              <span className="text-xs">{ship.kind}</span>
            </div>
          )}
        </div>
        <div className={`font-medium ${isDarkMode ? 'text-slate-100' : 'text-gray-800'}`}>
          {ship.agency}
        </div>
      </div>

      {/* Expanded Details with Smooth Animation */}
      <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <div className={`mt-3 rounded-lg border grid grid-cols-2 gap-px overflow-hidden ${isDarkMode ? 'bg-slate-700 border-slate-700' : 'bg-gray-200 border-gray-200'}`}>
            {/* Row 1: Berth | Draft */}
            <div className={`flex justify-between items-center p-3 ${isDarkMode ? 'bg-slate-800' : 'bg-gray-50'}`}>
              <span className={`text-xs flex items-center gap-1.5 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                <Anchor size={13} /> 접안
              </span>
              <span className={`text-xs ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>{ship.berth || '-'}</span>
            </div>
            <div className={`flex justify-between items-center p-3 ${isDarkMode ? 'bg-slate-800' : 'bg-gray-50'}`}>
              <span className={`text-xs flex items-center gap-1.5 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                <Ruler size={13} /> 홀수
              </span>
              <span className={`text-xs ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>{ship.draft ? `${ship.draft} m` : '-'}</span>
            </div>

            {/* Row 2: Tonnage | Tug */}
            <div className={`flex justify-between items-center p-3 ${isDarkMode ? 'bg-slate-800' : 'bg-gray-50'}`}>
              <span className={`text-xs flex items-center gap-1.5 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                <Scale size={13} /> 톤수
              </span>
              <span className={`text-xs ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>{ship.tonnage ? `${Number(ship.tonnage.replace(/,/g, '')).toLocaleString()} GT` : '-'}</span>
            </div>
            <div className={`flex justify-between items-center p-3 ${isDarkMode ? 'bg-slate-800' : 'bg-gray-50'}`}>
              <span className={`text-xs flex items-center gap-1.5 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                <Navigation size={13} /> 예선
              </span>
              <span className={`text-xs ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>{ship.tug || '-'}</span>
            </div>

            {/* Row 3: Gang-chwi | Call Sign */}
            <div className={`flex justify-between items-center p-3 ${isDarkMode ? 'bg-slate-800' : 'bg-gray-50'}`}>
              <span className={`text-xs flex items-center gap-1.5 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                <Wind size={13} /> 강취
              </span>
              <span className={`text-xs ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>{ship.gangchwi || '-'}</span>
            </div>
            <div className={`flex justify-between items-center p-3 ${isDarkMode ? 'bg-slate-800' : 'bg-gray-50'}`}>
              <span className={`text-xs flex items-center gap-1.5 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                <Radio size={13} /> 호출부호
              </span>
              <span className={`text-xs ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>{ship.callSign || '-'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full flex items-center justify-center mt-2 pt-1 pb-1 text-xs transition-colors ${isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-gray-500 hover:text-gray-800'}`}
        aria-label={isExpanded ? "접기" : "펼치기"}
      >
        {isExpanded ? (
          <ChevronUp size={16} />
        ) : (
          <ChevronDown size={16} />
        )}
      </button>
    </div>
  );
}
