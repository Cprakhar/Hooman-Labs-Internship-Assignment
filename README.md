# Conversational Insights

A minimal analytics dashboard prototype for AI-agent call data, built with Next.js, TypeScript, MobX State Tree, and Tailwind CSS.

## Features
- Filter and explore conversation data by agent, call type, status, duration, and cost
- KPI cards and charts for key metrics (total calls, success rate, average duration, cost, etc.)
- Dynamic dropdowns and range filters
- Responsive UI with modern styling

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Run the development server
```bash
npm run dev
```

- The app will be available at [http://localhost:3000](http://localhost:3000)

### 3. Build for production
```bash
npm run build
npm start
```

## Project Structure
- `/data/conversations.json` — mock conversation data
- `/lib/store/` — MobX State Tree models and store
- `/components/` — UI components (filters, charts, etc.)
- `/app/insights` — Main dashboard page

## Notes
- Requires Node.js 18+
- All state/logic is managed via MobX State Tree
- Styling uses Tailwind CSS

## License
MIT