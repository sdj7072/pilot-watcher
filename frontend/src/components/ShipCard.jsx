import React from 'react';
import StatusBadge from './StatusBadge';
import { Anchor, User } from 'lucide-react';

export default function ShipCard({ ship }) {
    return (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            {/* Header: Time, Date, Status */}
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-800">{ship.time}</span>
                    <span className="text-xs text-gray-400 font-medium">{ship.date}</span>
                </div>
                <StatusBadge status={ship.status} />
            </div>

            {/* Body: Name and Badges */}
            <div className="mb-3">
                <h3 className="text-base font-bold text-gray-900 mb-1.5">{ship.name}</h3>
                <div className="flex flex-wrap gap-1.5">
                    {ship.sections && ship.sections.map((sec, i) => (
                        <span key={i} className="bg-blue-50 text-blue-700 text-[10px] px-1.5 py-0.5 rounded border border-blue-100 font-mono font-medium">
                            {sec}
                        </span>
                    ))}
                    {ship.kind && (
                        <span className="bg-purple-50 text-purple-700 text-[10px] px-1.5 py-0.5 rounded border border-purple-100 font-medium">
                            {ship.kind}
                        </span>
                    )}
                    {ship.side && (
                        <span className="bg-orange-50 text-orange-700 text-[10px] px-1.5 py-0.5 rounded border border-orange-100 font-medium">
                            {ship.side}
                        </span>
                    )}
                </div>
            </div>

            {/* Footer: Details */}
            <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-50">
                <div className="flex items-center gap-2">
                    <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 font-medium">
                        {ship.type}
                    </span>
                    {ship.agency && (
                        <span className="text-gray-400 truncate max-w-[80px]" title={ship.agency}>
                            {ship.agency}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-1 font-medium">
                    <User size={12} className="text-gray-400" />
                    <span className="text-blue-600">{ship.pilot}</span>
                </div>
            </div>
        </div>
    );
}
