# Changelog

## [2.3.0] - 2025-11-28

### Advanced Optimizations
- **Backend Resilience**:
    - Implemented **Stale-while-revalidate** strategy to serve cached data during upstream failures.
    - Added **Zod** schema validation to ensure data integrity.
- **UX Polish**:
    - Integrated **Sonner** for elegant Toast notifications (success/error feedback).
    - Improved **Skeleton UI** to match the actual card layout for smoother loading.
- **SEO**:
    - Added `robots.txt` and `sitemap.xml` for better search engine indexing.
- **DevOps**:
    - Configured **Husky** and **Lint-staged** to enforce code quality checks on commit.
- **Documentation**:
    - Added project badges (Build, Release, License, Tech Stack) to README.

## [2.2.0] - 2025-11-28

### Optimization & Refactoring
- **Frontend Architecture**:
    - Introduced **SWR** for robust data fetching, caching, and auto-revalidation.
    - Refactored `App.tsx` into custom hooks: `usePilotData` and `useShipFilter`.
- **Mobile Experience (PWA)**:
    - Added **PWA support** with `vite-plugin-pwa`.
    - Users can now "Add to Home Screen" for an app-like experience.
    - Configured offline fallback and mobile meta tags.
- **Backend Performance**:
    - Added `Cache-Control: public, max-age=60` header to reduce server load and improve response times.
- **Stability**:
    - Set up **Vitest** and **React Testing Library** for unit testing.
    - Added **GitHub Actions CI** workflow to automate linting and testing.

## [2.1.0] - 2025-11-28

### UI/UX Polish
- **Sticky Header**: Added accessible controls for **Theme Toggle** and **Manual Refresh** directly in the sticky header.
- **Date Display**: Refined date headers to a clean, borderless style with `MM.DD(Day)` format (e.g., `11.28(Fri)`).
- **Typography**: Adjusted font sizes for time and ship names to improve visual hierarchy and readability.
- **Mobile Usability**: Added **Ship** and **External Link** icons to ship names to clearly indicate clickable links on touch devices.
- **Branding**: Updated Open Graph image and branding text to **"PILOT WATCHER"**.

## [2.0.0] - 2025-11-28

### Major Changes
- **Frontend Refactor**: Migrated from `jsx` to `tsx` (TypeScript).
- **Dark Mode**: Added support for Dark Mode (Antigravity Theme) and Light Mode (Classic).
- **Backend Robustness**: Improved HTML parsing logic.

### Added
- **Open Graph Support**: Added Open Graph meta tags and a generated preview image for better social media sharing (e.g., KakaoTalk).
- **IMO Number Lookup**: Implemented automatic IMO number lookup to provide direct links to ship details on VesselFinder.
- **Mobile-Friendly Header**: Restructured the sun/moon info bar to a two-row layout for better visibility on mobile devices.

### Changed
- **Header Layout**: Optimized the header design for mobile responsiveness.
- **Backend Logic**: Switched from direct VesselFinder scraping (blocked) to search engine-based scraping for ship details.

### Fixed
- **Date Display**: Removed redundant date text from the sun/moon info bar.

### Features
- **Auto Refresh**: Automatically refreshes data every 60 seconds.
- **UI/UX**: Added Skeleton UI, Error Handling UI, and improved Status Badge readability.
- **Components**: Refactored into `Header`, `ShipList`, `ShipCard`, `FilterBar`, etc.

### Configuration
- Optimized `tsconfig.json` and `tailwind.config.js` (v4).
