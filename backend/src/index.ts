import { parsePilotData, PilotData } from './parser';

export interface Env {
	PILOT_KV: KVNamespace;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);

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

		// 2. Cache Handling
		const cache = caches.default;
		let response = await cache.match(request);

		if (!response) {
			console.log("Cache miss. Fetching from origin...");
			try {
				// 3. Fetch Data
				const targetUrl = "http://ptpilot.co.kr/forecast/1";
				const originResponse = await fetch(targetUrl, {
					headers: {
						"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
					}
				});

				if (!originResponse.ok) {
					throw new Error(`Failed to fetch: ${originResponse.status}`);
				}

				// Use text() to respect the Content-Type header (UTF-8)
				// If the server claims UTF-8, we should trust it first.
				const html = await originResponse.text();

				// 4. Parse Data
				const data = parsePilotData(html);

				// 5. Create Response
				response = new Response(JSON.stringify(data), {
					headers: {
						"Content-Type": "application/json; charset=utf-8",
						"Access-Control-Allow-Origin": "*",
						"Cache-Control": "public, max-age=60, s-maxage=60", // Cache for 60s
					},
				});

				// 6. Save to Cache
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
			console.log("Cache hit!");
		}

		return response;
	},
};