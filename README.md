# Pilot Watcher

**Real-time Pilot Scheduling & Monitoring System**

Pilot Watcher is a modern, full-stack application designed to monitor and display pilot data for Pyeongtaek Port. It provides real-time tracking of pilot schedules, ship movements, and detailed vessel information with a premium, mobile-first user experience.

## Table of Contents

- [Features](#features)
- [Data Sources](#data-sources)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [License](#license)

## Features

- **Real-time Monitoring**: Automatically refreshes pilot data every 60 seconds.
- **Mobile-First Design**: Optimized layout for smartphones with touch-friendly interactions.
- **Smart Sticky Header**:
    - Unified search bar and "Today's Pilots" summary.
    - Quick access to **Theme Toggle** and **Manual Refresh** controls.
    - Stays accessible while scrolling.
- **Dark Mode Support**: Seamlessly switches between Light and Dark themes based on system preference or user toggle.
- **Advanced Filtering**: Filter ships by status (All, In Progress, Completed) and search by ship name or agency.
- **Vessel Integration**:
    - Automatic **IMO Number Lookup**.
    - Direct links to **VesselFinder** for detailed ship specifications.
    - Visual indicators for external links.
- **User Experience**:
    - Skeleton loading states for smooth transitions.
    - Clear status badges (Waiting, Onboard, Completed).
    - "Scroll to Top" button for easy navigation.

## Data Sources

This application aggregates data from the following sources:

1.  **Pyeongtaek-Dangjin Port Pilot's Association**: Primary source for pilot schedules and ship movements.
2.  **VesselFinder**: Secondary source for detailed ship specifications (IMO number, flag, type) linked via search.


## Tech Stack

- **Frontend**:
    - **Framework**: React 19.2.0
    - **Build Tool**: Vite 7.2.4
    - **Styling**: Tailwind CSS 4.1.17
    - **Data Fetching**: SWR 2.3.6
    - **PWA**: vite-plugin-pwa 1.2.0
    - **Testing**: Vitest 4.0.14, React Testing Library
- **Backend**: Cloudflare Workers (Serverless)
- **Deployment**: Cloudflare Pages (Frontend) & Workers (Backend)

## Project Structure

- **frontend/**: React application. Handles UI, state management, and data visualization.
- **backend/**: Cloudflare Workers script. Handles data fetching, HTML parsing, and API responses.

## Live Demo
[https://pilot-watcher.pages.dev](https://pilot-watcher.pages.dev)

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/pilot-watcher.git
    cd pilot-watcher
    ```

2.  Install dependencies:
    ```bash
    npm install && npm run install:all
    ```

### Running Locally

You can start both the frontend and backend with a single command:

**Method 1: npm (Recommended)**
```bash
npm run dev
```

**Method 2: Shell Script**
```bash
./dev.sh
```

Once started, you can access the application at:
- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend**: [http://localhost:8787](http://localhost:8787)

## Deployment

### Frontend (Cloudflare Pages)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### Backend (Cloudflare Workers)
- **Deploy Command**: `npm run deploy`

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
