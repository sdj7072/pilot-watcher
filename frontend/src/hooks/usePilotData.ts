import useSWR from 'swr';
import { PilotData } from '../types';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:8787' : 'https://backend.pilot-watcher.workers.dev');

export function usePilotData() {
    const { data, error, isLoading, mutate } = useSWR<PilotData>(API_URL, fetcher, {
        refreshInterval: 60000, // Auto refresh every 60s
        revalidateOnFocus: true,
        shouldRetryOnError: true,
    });

    return {
        data,
        isLoading,
        isError: error,
        mutate,
    };
}
