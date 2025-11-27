import React, { useState, useEffect } from 'react';
import { Ship, Sun, Anchor, RefreshCw, Search, Moon, Calendar } from 'lucide-react';
import ShipCard from './components/ShipCard';

// 백엔드 주소
const API_URL = "https://backend.pilot-watcher.workers.dev";

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("데이터 통신 에러:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 필터링 로직
  const filteredShips = data?.ships.filter(ship => {
    const statusMatch = filter === 'ALL' ||
      (filter === 'ING' && ship.status !== '완료') ||
      (filter === 'DONE' && ship.status === '완료');
    const nameMatch = ship.name.toUpperCase().includes(searchTerm.toUpperCase()) ||
      (ship.agency && ship.agency.toUpperCase().includes(searchTerm.toUpperCase()));
    return statusMatch && nameMatch;
  });

  // 날짜별 그룹핑
  const groupedShips = filteredShips?.reduce((acc, ship) => {
    const date = ship.date || '날짜 미상';
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(ship);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50 pb-10 select-none font-sans">
      {/* 1. 상단 헤더 */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-6 rounded-b-3xl shadow-xl sticky top-0 z-10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Ship className="w-7 h-7" />
              평택항 도선
            </h1>
            <p className="text-blue-100 text-sm opacity-90 font-medium mt-1">
              {data?.dateInfo || "데이터 로딩 중..."}
            </p>
          </div>
          <button
            onClick={fetchData}
            className="p-2.5 bg-white/10 rounded-full hover:bg-white/20 active:scale-95 transition backdrop-blur-sm"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        {/* 일출/일몰 (깔끔하게 정리) */}
        <div className="flex gap-3 text-xs font-semibold bg-black/20 p-3 rounded-xl backdrop-blur-md border border-white/10">
          <div className="flex items-center gap-1.5 text-yellow-300">
            <Sun size={14} /> <span>{data?.sunInfo.split('일몰')[0] || "일출 정보"}</span>
          </div>
          <div className="w-px bg-white/20 h-4"></div>
          <div className="flex items-center gap-1.5 text-orange-200">
            <Moon size={14} /> <span>{data?.sunInfo.split('일출')[1] || "일몰 정보"}</span>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-6 relative z-0">

        {/* 2. 당직 도선사 카드 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
          <h2 className="text-gray-800 font-bold mb-3 flex items-center gap-2 text-sm uppercase tracking-wider text-blue-600">
            <Anchor size={16} /> Today's Pilot
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {data?.pilots.slice(0, 4).map((p, i) => ( // 상위 4명만 표시
              <div key={i} className="bg-gray-50 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 border border-gray-100 text-center">
                {p}
              </div>
            ))}
          </div>
        </div>

        {/* 3. 검색 및 필터 */}
        <div className="mb-6 sticky top-[180px] z-20 bg-gray-50 pt-2 pb-2">
          <div className="relative group mb-3">
            <Search className="absolute left-3.5 top-3.5 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="선박명 또는 대리점 검색..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border-0 shadow-sm ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-500 transition-all outline-none text-gray-700 placeholder-gray-400"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {['ALL', 'ING', 'DONE'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${filter === f
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                  : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
                  }`}
              >
                {f === 'ALL' ? '전체' : f === 'ING' ? '진행/예정' : '완료'}
              </button>
            ))}
          </div>
        </div>

        {/* 4. 선박 리스트 (그룹화) */}
        <div className="space-y-6 pb-20">
          {groupedShips && Object.keys(groupedShips).sort().map((date) => (
            <div key={date}>
              <div className="flex items-center gap-2 mb-3 px-1">
                <Calendar size={16} className="text-gray-400" />
                <h3 className="text-sm font-bold text-gray-500">{date}</h3>
                <div className="h-px bg-gray-200 flex-1"></div>
              </div>
              <div className="space-y-3">
                {groupedShips[date].map((ship, idx) => (
                  <ShipCard key={`${date}-${idx}`} ship={ship} />
                ))}
              </div>
            </div>
          ))}

          {(!filteredShips || filteredShips.length === 0) && (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <Ship size={40} className="mb-2 opacity-20" />
              <p>{loading ? "데이터를 불러오는 중..." : "조건에 맞는 선박이 없습니다."}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}