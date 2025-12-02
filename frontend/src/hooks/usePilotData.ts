import useSWR from 'swr';
import { useState, useEffect } from 'react';
import { PilotData } from '../types';

const fetcher = async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Network response was not ok: ${res.status}`);
    }
    return res.json();
};

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://127.0.0.1:8787' : 'https://backend.pilot-watcher.workers.dev');

export function usePilotData() {
    // Add a delay to prevent "Socket is not connected" error on app launch
    // Increased to 1500ms to be safe
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsReady(true), 1500);
        return () => clearTimeout(timer);
    }, []);

    const { data, error, isLoading, mutate, isValidating } = useSWR<PilotData>(isReady ? API_URL : null, fetcher, {
        refreshInterval: 60000, // Auto refresh every 60s
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        shouldRetryOnError: true,
        errorRetryInterval: 3000, // Initial retry after 3s
        errorRetryCount: 10,      // Retry up to 10 times before pausing (optional, but good for safety)
        onErrorRetry: (_error, _key, _config, revalidate, { retryCount }) => {
            // Never give up, but cap the backoff
            // Default SWR behavior is exponential. We want to cap it.

            // 404 is usually permanent, but for this app it might mean "no data yet" or server issue, so we retry.
            // if (error.status === 404) return;

            // Cap retry delay at 5 seconds
            const delay = Math.min(retryCount * 1000, 5000);
            setTimeout(() => revalidate({ retryCount }), delay);
        }
    });

    return {
        data,
        isLoading,
        isError: error,
        mutate,
        isValidating,
    };
}
