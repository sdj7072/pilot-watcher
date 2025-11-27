# Pilot Watcher

Pilot Watcher is a full-stack application designed to monitor and display pilot data. It consists of a React frontend and a Cloudflare Workers backend.

## Project Structure

- **frontend/**: React application built with Vite. Handles the user interface and data visualization.
- **backend/**: Cloudflare Workers application. Handles data fetching, processing, and API endpoints.

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

2.  Install dependencies for both frontend and backend:
    ```bash
    cd frontend && npm install
    cd ../backend && npm install
    ```

### Running Locally

**Frontend:**
```bash
cd frontend
npm run dev
```

**Backend:**
```bash
cd backend
npm run dev
```

## Deployment

### Frontend (Cloudflare Pages)
The frontend is designed to be deployed to Cloudflare Pages.
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### Backend (Cloudflare Workers)
The backend is deployed to Cloudflare Workers.
- **Deploy Command**: `npm run deploy`

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
