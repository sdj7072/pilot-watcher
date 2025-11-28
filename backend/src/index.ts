import * as cheerio from 'cheerio';
import { z } from 'zod';

export interface Env {
	PILOT_KV: KVNamespace;
}

// Zod Schema Definition
const ShipSchema = z.object({
	date: z.string(),
	time: z.string(),
	name: z.string(),
	status: z.string(),
	pilot: z.string(),
	sections: z.array(z.string()),
	type: z.string(),
	kind: z.string(),
	side: z.string(),
	agency: z.string(),
	link: z.string().optional(),
});

const TideSchema = z.object({
	time: z.string(),
	height: z.string(),
	current: z.string(),
	maxTime: z.string(),
	maxCurrent: z.string(),
});

const PilotDataSchema = z.object({
	updatedAt: z.string(),
	dateInfo: z.string(),
	sunInfo: z.string(),
	pilots: z.array(z.string()),
	tides: z.array(TideSchema),
	ships: z.array(ShipSchema),
});

type PilotData = z.infer<typeof PilotDataSchema>;

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const corsHeaders = {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS",
			"Content-Type": "application/json; charset=utf-8",
			"Cache-Control": "public, max-age=60",
		};

		if (request.method === "OPTIONS") {
			return new Response(null, { headers: corsHeaders });
		}

		const cacheKey = "pilot-data-v3";
		const url = new URL(request.url);
		const isRefresh = url.searchParams.get('refresh');

		let cachedData: PilotData | null = null;

		// 1. Try to get cached data first (Stale-while-revalidate)
		try {
			const rawCache = await env.PILOT_KV.get(cacheKey);
			if (rawCache) {
				cachedData = JSON.parse(rawCache);
			}
		} catch (e) {
			console.error("Cache read error:", e);
		}

		// If not forcing refresh and we have cache, return it immediately (if fresh enough? No, we return stale and revalidate in background if needed, but here we just return cache if exists and let client handle revalidation via SWR, OR we fetch fresh if cache is missing/refresh requested)
		// Actually, for a simple implementation:
		// - If refresh=true: Fetch fresh, update cache, return fresh.
		// - If refresh=false:
		//   - If cache exists: Return cache.
		//   - If cache missing: Fetch fresh, update cache, return fresh.

		// But to be more resilient (Stale-while-revalidate on server side is tricky without background workers).
		// Better approach for "Resilience":
		// Try to fetch fresh data.
		// If fetch succeeds -> Update cache -> Return fresh.
		// If fetch fails ->
		//    If cache exists -> Return cache (Stale) with a warning header?
		//    If cache missing -> Return Error.

		if (!isRefresh && cachedData) {
			return new Response(JSON.stringify(cachedData), { headers: corsHeaders });
		}

		try {
			// 2. Fetch from Source
			const targetUrl = 'http://www.ptpilot.co.kr/forecast/1';
			const response = await fetch(targetUrl);

			if (!response.ok) throw new Error(`Source responded with ${response.status}`);

			const html = await response.text();

			// 3. Parse HTML
			const $ = cheerio.load(html);
			const cleanText = (text: string) => text.replace(/\s+/g, ' ').trim();

			// ... (Parsing logic remains mostly same, just ensuring types) ...

			// (1) Date Info
			let dateInfo = "날짜 정보 없음";
			$('td').each((i, el) => {
				const text = cleanText($(el).text());
				if (text.match(/\d{4}-\d{2}-\d{2}/) && text.includes('요일')) {
					dateInfo = text;
				}
			});

			// (2) Sun Info
			const sunInfo = cleanText($('td:contains("일출")').text()) || "정보 없음";

			// (3) Pilots
			const pilots: string[] = [];
			$('tr').each((i, el) => {
				const text = $(el).text();
				if (text.includes("1대기") && text.includes("2대기")) {
					const cleanLines = text.replace(/\t/g, '').split('\n').map(t => cleanText(t)).filter(t => t.length > 1);
					pilots.push(...cleanLines);
				}
			});

			// (4) Tides
			const tides: any[] = [];
			$('table').each((i, table) => {
				if ($(table).text().includes("조석시간") && $(table).text().includes("조석조고")) {
					const rows = $(table).find('> tbody > tr, > tr');
					rows.each((j, row) => {
						const tds = $(row).find('td');
						const firstCol = cleanText($(tds[0]).text());
						if (tds.length >= 10 && (firstCol === "조석시간" || firstCol.match(/\d{2}:\d{2}/))) {
							tides.push({
								time: firstCol,
								height: cleanText($(tds[1]).text()),
								current: cleanText($(tds[2]).text()),
								maxTime: cleanText($(tds[3]).text()),
								maxCurrent: cleanText($(tds[4]).text())
							});
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

			// 5. Ships
			const ships: any[] = [];
			let colMap: Record<string, number> = {
				status: 1, pilot: 2, date: 3, time: 4, kind: 5, name: 6,
				section1: 7, section2: 8, side: 9, tonnage: 10, agency: 12 // Updated default to 12
			};

			$('table').each((i, table) => {
				// Try to find header row: look for thead tr, OR the first tr that contains "도선사"
				let headerRow = $(table).find('thead tr').first();
				if (headerRow.length === 0) {
					$(table).find('tr').each((j, row) => {
						if ($(row).text().includes("도선사") && $(row).text().includes("선명")) {
							headerRow = $(row);
							return false; // break
						}
					});
				}

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
								// If colspan is 2, next index is section2 (but in data row it's separate tds)
								// Header parsing is tricky with colspan. 
								// But usually we rely on data row indices.
								// If header has colspan=2, it counts as 1 cell in header iteration?
								// Cheerio/HTML treats it as 1 element.
								// So if we find "도선구간", we assume it maps to section1.
								// And we need to manually adjust subsequent indices if we rely on header index.
								// BUT, the current logic uses `idx` from header iteration.
								// If header has fewer cells than data row (due to colspan), this dynamic mapping might be OFF for subsequent columns.
								// Let's rely on the default mapping (12) which we verified manually, 
								// and only update if we are sure.
								// Actually, let's trust the manual verification more for now.
							}
						}
						// "접안" is after "도선구간". If "도선구간" has colspan=2, "접안" in header is at idx+1.
						// But in data row, it's at idx+2 relative to section1.
						// This dynamic mapping is risky if colspan is involved.
						// Let's stick to the fixed indices we found, but keep the code for "agency" detection if it's explicit.
						if (text.includes("대리점")) {
							// In header, "대리점" is at index 11 (0..11).
							// 0:번호, 1:상태, 2:도선사, 3:일자, 4:시간, 5:긴특, 6:선명, 7:구간, 8:접안, 9:톤수, 10:홀수, 11:대리점
							// But in data row, "구간" splits into 2 tds. So indices shift by +1 after section.
							// Header index 11 corresponds to Data index 12.
							colMap.agency = idx + 1; // Adjust for colspan
						}
					});
				}
			});

			$('tr').each((i, el) => {
				const tds = $(el).find('td');
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

					if (time.includes(":") && name) {
						ships.push({
							date, time, name, status, pilot,
							sections: [section1, section2].filter(s => s),
							type: tonnage, kind, side, agency,
							link: `https://www.vesselfinder.com/vessels?name=${encodeURIComponent(name)}`
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

			// 4. Validate with Zod
			const validatedResult = PilotDataSchema.parse(result);

			// 5. Update Cache
			if (env.PILOT_KV) {
				await env.PILOT_KV.put(cacheKey, JSON.stringify(validatedResult), { expirationTtl: 600 });
			}

			return new Response(JSON.stringify(validatedResult), { headers: corsHeaders });

		} catch (error: any) {
			console.error("Fetch/Parse Error:", error);

			// Fallback: Return cached data if available (even if stale)
			if (cachedData) {
				const staleHeaders = { ...corsHeaders, "X-Pilot-Data-Stale": "true" };
				return new Response(JSON.stringify(cachedData), { headers: staleHeaders });
			}

			return new Response(JSON.stringify({ error: error.message, stack: error.stack }), {
				status: 500,
				headers: corsHeaders
			});
		}
	},
};