import { parsePilotData } from '../src/parser';

async function verifyLive() {
    console.log("🔍 Verifying Live Data from ptpilot.co.kr...");

    try {
        const targetUrl = "http://ptpilot.co.kr/forecast/1";
        const response = await fetch(targetUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status}`);
        }

        // Use text() to respect server encoding (UTF-8)
        const html = await response.text();
        console.log(`✅ Fetched HTML (${html.length} bytes)`);

        const data = parsePilotData(html);

        console.log("\n📊 Verification Results:");
        console.log("--------------------------------------------------");
        console.log(`📅 Date Info: ${data.dateInfo}`);
        console.log(`☀️ Sun Info:  ${data.sunInfo}`);
        console.log(`🚢 Ships Found: ${data.ships.length}`);
        console.log("--------------------------------------------------");

        if (data.ships.length > 0) {
            console.table(data.ships.map(s => ({
                Name: s.name,
                Pilot: s.pilot,
                Time: s.time,
                Status: s.status,
                Section: s.sections.join(', '),
                Side: s.side,
                Tonnage: s.tonnage,
                Gangchwi: s.gangchwi,
                CallSign: s.callSign
            })));
        } else {
            console.warn("⚠️ No ships found! Check parser logic or source HTML.");
        }

        console.log("\n✅ Verification Complete.");

    } catch (error) {
        console.error("❌ Verification Failed:", error);
        process.exit(1);
    }
}

verifyLive();
