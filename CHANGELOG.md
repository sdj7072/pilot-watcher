# Changelog

## [3.2.0] - 2025-11-29

### Verification Workflow
- **Live Verification**:
    - Added `backend/scripts/verify-live.ts` to fetch and parse live data from `ptpilot.co.kr`.
    - Added `npm run verify` command to backend package.json.
    - Enables easy verification of parser integrity against real-time data.

## [3.1.1] - 2025-11-29

### Parsing Logic Fixes
- **Data Accuracy**:
    - **Encoding**: Fixed broken Korean characters and numbers by respecting server's UTF-8 Content-Type (removed forced EUC-KR decoding).
    - **Sun Info**: Fixed missing sunrise/sunset times by improving selector logic to find "일출" and "일몰" text robustly.
    - **Column Mapping**: Fixed Gangchwi/CallSign mismatch by implementing robust `colspan` handling for irregular table headers.

## [3.1.0] - 2025-11-29

### Stability & UX Improvements
- **Backend Stability**:
    - **Fixture Tests**: Added real-world HTML fixture (`sample.ts`) and regression tests to protect against parser breakage.
    - **Caching**: Implemented Cloudflare Cache API to cache responses for 60 seconds, reducing upstream load.
- **User Experience**:
    - **Error Handling**: Added a dedicated Error State UI with a "Retry" button for failed data loads.

## [3.0.0] - 2025-11-29

### Major UI Redesign & Refactoring
- **UI/UX Overhaul**:
    - **Card Redesign**: Completely revamped `ShipCard` with a cleaner, more organized layout.
        - **Expanded View**: New grid-based layout for detailed information (Berth, Draft, Tonnage, etc.) with clear icons.
        - **Pilotage Sections**: Enhanced readability with bold text, red highlighting for critical stations (IPA, JANG), and arrow indicators.
        - **Status Badges**: Refined colors and typography for better visual distinction.
    - **Mobile Optimization**: Adjusted header font size for better fit on small screens.
    - **Animations**: Added smooth expand/collapse animations for ship details.
- **Architecture & Code Quality**:
    - **Shared Types**: Introduced a `packages/shared` workspace to share TypeScript definitions between Frontend and Backend.
    - **Refactoring**:
        - Extracted `getPilotType` logic to `frontend/src/utils/pilotUtils.ts`.
        - Extracted HTML parsing logic to `backend/src/parser.ts`.
    - **Testing**:
        - Added comprehensive unit tests for `pilotUtils` (Frontend) and `parser` (Backend) using Vitest.
- **Logic Enhancements**:
    - **Pilotage Classification**: Improved logic to correctly classify "Arrival" (입항), "Departure" (출항), "Shift" (이항) based on specific section codes (e.g., E14, E16).
    - **Time-Based Dark Mode**: Implemented automatic theme switching based on time (17:30 - 07:00).
    - **Data Parsing**: Fixed missing data issues for Tug, Gangchwi, and CallSign by implementing robust `colspan` handling in the backend parser.
- **Visual Polish**:
    - **Badge Visibility**: Updated pilotage type badges to use solid colors for better contrast.
    - **Expanded View**: Improved text contrast for labels in the expanded ship details view.
    - **Typography**: Adjusted font sizes for badges to match section text.

## [2.4.0] - 2025-11-29

### Data Accuracy & UI Refinements
- **Data Integrity**:
    - **Ship Details**: Corrected the display of Tonnage and Draft by fixing column index mapping in the backend.
    - **Section Codes**: Resolved an issue where row numbers were incorrectly displayed as section codes. Ship cards now show valid section codes (e.g., "E12", "IPA").
- **UI Improvements**:
    - **Typography**: Updated visual hierarchy - Ship names are now **Bold**, and Agency names are Medium.
    - **Status Badges**: Introduced a distinct **Orange** color for 'Request' (요청) status for better visibility.
    - **Search Bar**: Enhanced contrast for the search icon and border in Dark Mode.
- **Local Development**:
    - **Connectivity**: Fixed local data fetching issues by enforcing IPv4 (`127.0.0.1`) connections.
    - **Stability**: Resolved backend syntax errors to ensure reliable server startup.

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
