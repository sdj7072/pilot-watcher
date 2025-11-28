import * as cheerio from 'cheerio';


export interface Env {
	PILOT_KV: KVNamespace;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const corsHeaders = {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS",
			"Content-Type": "application/json; charset=utf-8",
		};

		if (request.method === "OPTIONS") {
			return new Response(null, { headers: corsHeaders });
		}

		// 1. 캐시 확인
		const cacheKey = "pilot-data-v2"; // 키 버전 변경
		const url = new URL(request.url);
		const isRefresh = url.searchParams.get('refresh');

		if (!isRefresh) {
			try {
				const cachedData = await env.PILOT_KV.get(cacheKey);
				if (cachedData) {
					return new Response(cachedData, { headers: corsHeaders });
				}
			} catch (e) { }
		}

		try {
			// 2. 원본 사이트 가져오기
			const targetUrl = 'http://www.ptpilot.co.kr/forecast/1';
			const response = await fetch(targetUrl);

			// 데이터를 '생'으로 가져와서 iconv로 해독 -> UTF-8이므로 text() 사용
			const html = await response.text();

			// 3. HTML 파싱
			const $ = cheerio.load(html);

			// 텍스트 정제 헬퍼 함수
			const cleanText = (text: string) => text.replace(/\s+/g, ' ').trim();

			// (1) 날짜 정보 추출
			let dateInfo = "날짜 정보 없음";
			$('td').each((i, el) => {
				const text = cleanText($(el).text());
				// "2025-11-27 목요일" 같은 패턴 찾기
				if (text.match(/\d{4}-\d{2}-\d{2}/) && text.includes('요일')) {
					dateInfo = text;
				}
			});

			// (2) 일출/일몰 추출
			const sunInfo = cleanText($('td:contains("일출")').text()) || "정보 없음";

			// (3) 당직 도선사 추출
			const pilots: string[] = [];
			$('tr').each((i, el) => {
				const text = $(el).text();
				if (text.includes("1대기") && text.includes("2대기")) {
					// 불필요한 공백과 탭 제거 후 깔끔하게 정리
					const cleanLines = text.replace(/\t/g, '').split('\n').map(t => cleanText(t)).filter(t => t.length > 1);
					pilots.push(...cleanLines);
				}
			});

			// (4) 조석 정보 추출
			const tides: any[] = [];
			$('table').each((i, table) => {
				// 조석 정보가 있는 테이블만 타겟팅
				if ($(table).text().includes("조석시간") && $(table).text().includes("조석조고")) {
					// 중첩 테이블 문제 방지를 위해 직계 자식 tr만 순회
					const rows = $(table).find('> tbody > tr, > tr');

					rows.each((j, row) => {
						const tds = $(row).find('td');
						const firstCol = cleanText($(tds[0]).text());

						// 헤더 행이거나, 시간 정보가 있는 데이터 행인 경우 추출
						if (tds.length >= 10 && (firstCol === "조석시간" || firstCol.match(/\d{2}:\d{2}/))) {
							tides.push({
								time: firstCol,
								height: cleanText($(tds[1]).text()),
								current: cleanText($(tds[2]).text()),
								maxTime: cleanText($(tds[3]).text()),
								maxCurrent: cleanText($(tds[4]).text())
							});

							// 오후 조석 정보 (데이터 행인 경우에만 존재)
							const sixthCol = cleanText($(tds[5]).text());
							if (sixthCol === "조석시각" || sixthCol.match(/\d{2}:\d{2}/)) {
								tides.push({
									time: sixthCol,
									height: cleanText($(tds[6]).text()),
									current: cleanText($(tds[7]).text()),
									maxTime: cleanText($(tds[8]).text()),
									maxCurrent: cleanText($(tds[9]).text())
								});
							}
						}
					});
				}
			});

			// (5) 선박 리스트 추출 (정밀 분석)
			const ships: any[] = [];

			// 헤더 인덱스 매핑 (기본값)
			let colMap: Record<string, number> = {
				status: 1, pilot: 2, date: 3, time: 4, kind: 5, name: 6,
				section1: 7, section2: 8, side: 9, tonnage: 10, agency: 11
			};

			// 테이블 헤더 찾기 시도
			$('table').each((i, table) => {
				const headerRow = $(table).find('thead tr').first();
				if (headerRow.length > 0) {
					headerRow.find('th, td').each((idx, cell) => {
						const text = cleanText($(cell).text());
						if (text.includes("상태")) colMap.status = idx;
						if (text.includes("도선사")) colMap.pilot = idx;
						if (text.includes("일자")) colMap.date = idx;
						if (text.includes("시간")) colMap.time = idx;
						if (text.includes("긴특")) colMap.kind = idx;
						if (text.includes("선명")) colMap.name = idx;
						if (text.includes("도선구간")) {
							if (!colMap.section1_found) {
								colMap.section1 = idx;
								colMap.section1_found = 1;
							} else {
								colMap.section2 = idx;
							}
						}
						if (text.includes("접안")) colMap.side = idx;
						if (text.includes("톤수")) colMap.tonnage = idx;
						if (text.includes("대리점")) colMap.agency = idx;
					});
				}
			});

			// tr을 순회하며 데이터가 있는 행만 골라냄
			$('tr').each((i, el) => {
				const tds = $(el).find('td');

				// 데이터 행은 보통 td가 10개 이상임
				if (tds.length > 10) {
					const getText = (idx: number) => cleanText($(tds[idx]).text());

					const status = getText(colMap.status);
					const pilot = getText(colMap.pilot);
					const date = getText(colMap.date);
					const time = getText(colMap.time);
					const kind = getText(colMap.kind);
					const name = getText(colMap.name);
					const section1 = getText(colMap.section1);
					const section2 = getText(colMap.section2);
					const side = getText(colMap.side);
					const tonnage = getText(colMap.tonnage);
					const agency = getText(colMap.agency);

					// 시간이 포맷(00:00)에 맞고, 선명이 있는 경우만 추가
					if (time.includes(":") && name) {
						ships.push({
							date,
							time,
							name,
							status,
							pilot,
							sections: [section1, section2].filter(s => s),
							type: tonnage,
							kind,
							side,
							agency
						});
					}
				}
			});

			const result = {
				updatedAt: new Date().toISOString(),
				dateInfo,
				sunInfo,
				pilots: pilots.length > 0 ? pilots : ["당직 정보 없음"],
				tides,
				ships
			};

			// KV 저장
			if (env.PILOT_KV) {
				await env.PILOT_KV.put(cacheKey, JSON.stringify(result), { expirationTtl: 600 });
			}

			return new Response(JSON.stringify(result), { headers: corsHeaders });

		} catch (error: any) {
			return new Response(JSON.stringify({ error: error.message, stack: error.stack }), {
				status: 500,
				headers: corsHeaders
			});
		}
	},
};