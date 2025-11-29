import * as cheerio from 'cheerio';
import { z } from 'zod';

// Zod Schema Definition
export const ShipSchema = z.object({
    date: z.string(),
    time: z.string(),
    name: z.string(),
    status: z.string(),
    pilot: z.string(),
    sections: z.array(z.string()),
    tonnage: z.string(),
    kind: z.string(),
    side: z.string(),
    agency: z.string(),
    draft: z.string(),
    berth: z.string().optional(),
    tug: z.string().optional(),
    gangchwi: z.string().optional(),
    callSign: z.string().optional(),
    link: z.string().optional(),
});

export const TideSchema = z.object({
    time: z.string(),
    height: z.string(),
    current: z.string(),
    maxTime: z.string(),
    maxCurrent: z.string(),
});

export const PilotDataSchema = z.object({
    updatedAt: z.string(),
    dateInfo: z.string(),
    sunInfo: z.string(),
    pilots: z.array(z.string()),
    tides: z.array(TideSchema),
    ships: z.array(ShipSchema),
});

export type PilotData = z.infer<typeof PilotDataSchema>;

export const parsePilotData = (html: string): PilotData => {
    const $ = cheerio.load(html);
    const cleanText = (text: string) => text.replace(/\s+/g, ' ').trim();

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
        section1: 7, section2: 8, side: 9, tonnage: 10, draft: 11, agency: 12,
        berth: 13, tug: 14, gangchwi: 15, callSign: 16,
        section1_found: 0
    };

    $('table').each((i, table) => {
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
            let currentColIndex = 0;
            headerRow.find('th, td').each((idx, cell) => {
                const text = cleanText($(cell).text());
                const colspan = parseInt($(cell).attr('colspan') || '1', 10);

                if (text.includes("상태")) colMap.status = currentColIndex;
                if (text.includes("도선사")) colMap.pilot = currentColIndex;
                if (text.includes("일자")) colMap.date = currentColIndex;
                if (text.includes("시간")) colMap.time = currentColIndex;
                if (text.includes("긴특")) colMap.kind = currentColIndex;
                if (text.includes("선명")) colMap.name = currentColIndex;
                // Section usually has colspan=2, so we map section1 to start, section2 to start+1
                if (text.includes("도선구간")) {
                    colMap.section1 = currentColIndex;
                    colMap.section2 = currentColIndex + 1;
                }
                if (text.includes("Side")) colMap.side = currentColIndex; // Assuming Side is explicitly named or we rely on default if not found
                if (text.includes("톤수")) colMap.tonnage = currentColIndex;
                if (text.includes("홀수")) colMap.draft = currentColIndex;
                if (text.includes("대리점")) colMap.agency = currentColIndex;
                if (text.includes("접안")) colMap.berth = currentColIndex;
                if (text.includes("예선")) colMap.tug = currentColIndex;
                if (text.includes("강취")) colMap.gangchwi = currentColIndex;
                if (text.includes("호출")) colMap.callSign = currentColIndex;

                currentColIndex += colspan;
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
            const draft = getText(colMap.draft);
            const agency = getText(colMap.agency);
            const berth = getText(colMap.berth);
            const tug = getText(colMap.tug);
            const gangchwi = getText(colMap.gangchwi);
            const callSign = getText(colMap.callSign);

            if (time.includes(":") && name) {
                ships.push({
                    date, time, name, status, pilot,
                    sections: [section1, section2].filter(s => s),
                    tonnage, kind, side, agency, draft,
                    berth, tug, gangchwi, callSign,
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

    return PilotDataSchema.parse(result);
};
