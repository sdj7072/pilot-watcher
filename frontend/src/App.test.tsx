import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

// Mock the custom hooks
vi.mock('./hooks/usePilotData', () => ({
    usePilotData: () => ({
        data: null,
        isLoading: true,
        isError: null,
        mutate: vi.fn(),
    }),
}));

vi.mock('./hooks/useShipFilter', () => ({
    useShipFilter: () => ({
        searchTerm: '',
        setSearchTerm: vi.fn(),
        statusFilter: 'ALL',
        setStatusFilter: vi.fn(),
        filteredShips: [],
    }),
}));

// Mock ThemeContext
vi.mock('./context/ThemeContext', () => ({
    ThemeProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    useTheme: () => ({ isDarkMode: false, toggleTheme: vi.fn() }),
}));

// Mock IntersectionObserver
class MockIntersectionObserver {
    observe() { return null; }
    unobserve() { return null; }
    disconnect() { return null; }
}
window.IntersectionObserver = MockIntersectionObserver as any;

// Mock scrollTo
window.scrollTo = vi.fn();

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

// Mock ResizeObserver
window.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));

describe('App Component', () => {
    it('renders without crashing', () => {
        render(<App />);
        // Check if Header is rendered (it contains "도선 예보")
        expect(screen.getByText(/평택항 도선 현황/i)).toBeDefined();
    });
});
