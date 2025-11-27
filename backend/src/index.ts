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

			// tr을 순회하며 데이터가 있는 행만 골라냄
			$('tr').each((i, el) => {
				const tds = $(el).find('td');

				// 데이터 행은 보통 td가 10개 이상임
				if (tds.length > 12) {
					// 인덱스 매핑 (page.html 분석 결과)
					// 0: 번호, 1: 상태, 2: 도선사, 3: 일자, 4: 시간, 5: 긴특(Kind), 6: 선명
					// 7: 도선구간1, 8: 도선구간2, 9: 접안(Side), 10: 톤수, 11: 홀수, 12: 대리점 ...

					const status = cleanText($(tds[1]).text());
					const pilot = cleanText($(tds[2]).text());
					const date = cleanText($(tds[3]).text()); // 일자
					const time = cleanText($(tds[4]).text());
					const kind = cleanText($(tds[5]).text());
					const name = cleanText($(tds[6]).text());
					const section1 = cleanText($(tds[7]).text());
					const section2 = cleanText($(tds[8]).text());
					const side = cleanText($(tds[9]).text());
					const tonnage = cleanText($(tds[10]).text());
					const agency = cleanText($(tds[11]).text()); // 대리점

					// 시간이 포맷(00:00)에 맞고, 선명이 있는 경우만 추가
					if (time.includes(":")) {
						ships.push({
							date,
							time,
							name,
							status,
							pilot,
							sections: [section1, section2].filter(s => s), // 빈 값 제거
							type: tonnage, // 기존 호환성 유지 (톤수)
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