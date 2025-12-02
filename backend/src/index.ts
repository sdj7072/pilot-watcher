import { parsePilotData, PilotData } from './parser';

export interface Env {
	PILOT_KV: KVNamespace;
}

// Helper function to fetch from origin, parse, and store in KV
async function fetchAndCacheData(env: Env): Promise<any> {
	console.log("Fetching from origin...");
	const targetUrl = "http://ptpilot.co.kr/forecast/1";
	const originResponse = await fetch(targetUrl, {
		headers: {
			"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
		}
	});

	if (!originResponse.ok) {
		throw new Error(`Failed to fetch: ${originResponse.status}`);
	}

	const html = await originResponse.text();
	const data = parsePilotData(html);

	// Store in KV
	await env.PILOT_KV.put("LATEST_DATA", JSON.stringify(data));
	console.log("Data cached in KV");

	return data;
}

export default {
	// Cron Trigger Handler
	async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
		ctx.waitUntil(fetchAndCacheData(env));
	},

	// HTTP Request Handler
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		// 1. Handle CORS Preflight
		if (request.method === "OPTIONS") {
			return new Response(null, {
				headers: {
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Methods": "GET, OPTIONS",
					"Access-Control-Allow-Headers": "Content-Type",
				},
			});
		}

		// 2. Cache Handling (Edge Cache)
		const cache = caches.default;
		let response = await cache.match(request);

		if (!response) {
			try {
				// 3. Try to get from KV first
				let data = await env.PILOT_KV.get("LATEST_DATA", "json");

				// 4. Fallback: If KV is empty (first run), fetch from origin
				if (!data) {
					console.log("KV miss. Fetching from origin...");
					data = await fetchAndCacheData(env);
				} else {
					console.log("KV hit!");
				}

				// 5. Create Response
				response = new Response(JSON.stringify(data), {
					headers: {
						"Content-Type": "application/json; charset=utf-8",
						"Access-Control-Allow-Origin": "*",
						"Cache-Control": "public, max-age=60, s-maxage=60", // Cache for 60s
					},
				});

				// 6. Save to Edge Cache
				ctx.waitUntil(cache.put(request, response.clone()));

			} catch (error) {
				console.error("Error fetching data:", error);
				return new Response(JSON.stringify({ error: "Failed to fetch data", details: String(error) }), {
					status: 500,
					headers: {
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*",
					},
				});
			}
		} else {
			console.log("Edge Cache hit!");
		}

		return response;
	},
};