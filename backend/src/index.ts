import { parsePilotData, PilotData } from './parser';

export interface Env {
	PILOT_KV: KVNamespace;
}

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

		if (!isRefresh && cachedData) {
			return new Response(JSON.stringify(cachedData), { headers: corsHeaders });
		}

		try {
			// 2. Fetch from Source
			const targetUrl = 'http://www.ptpilot.co.kr/forecast/1';
			const response = await fetch(targetUrl);

			if (!response.ok) throw new Error(`Source responded with ${response.status}`);

			const html = await response.text();

			// 3. Parse HTML & Validate (using extracted logic)
			const validatedResult = parsePilotData(html);

			// 4. Update Cache
			if (env.PILOT_KV) {
				await env.PILOT_KV.put(cacheKey, JSON.stringify(validatedResult), { expirationTtl: 600 });
			}

			return new Response(JSON.stringify(validatedResult), { headers: corsHeaders });

		} catch (error: any) {
			console.error("Fetch/Parse Error:", error);

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