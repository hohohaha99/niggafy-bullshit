# CrowdMonitor - AI-Powered Crowd Management System

A modern web application for real-time crowd monitoring and smart gate redirection using AI and predictive analytics.

## Features

- 🎯 **Real-Time Monitoring**: Live crowd tracking at multiple venue gates
- 🤖 **AI-Powered Predictions**: Forecast crowd levels 5-15 minutes ahead
- 🧠 **Smart Recommendations**: Intelligent gate suggestions based on crowd levels, distance, and wait times
- 📊 **Interactive Dashboard**: Beautiful, responsive interface with live updates
- 📈 **Trend Analysis**: Visualize crowd patterns with sparkline charts
- ⚡ **Lightning Fast**: Built with Next.js 14 and optimized for performance

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
crowd-monitor-app/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx             # Main dashboard page
│   └── globals.css          # Global styles
├── components/
│   ├── Header.tsx           # App header
│   ├── VenueMap.tsx         # Interactive venue map
│   ├── GateStatusPanel.tsx  # Gate status sidebar
│   └── RecommendationCard.tsx # Smart recommendation card
├── types/
│   └── index.ts             # TypeScript type definitions
├── lib/
│   └── mockData.ts          # Mock data generator
└── public/                  # Static assets
```

## Features Demonstrated

### Real-Time Updates
The app simulates real-time crowd data updates every 5 seconds using realistic sine/cosine functions for natural variation.

### Smart Recommendations
The system analyzes all gates and recommends the optimal gate based on:
- Current crowd levels
- Wait times
- Walking distance
- Trend predictions
- Accessibility requirements

### Interactive Visualization
- Color-coded gate markers (Green/Yellow/Orange/Red)
- Animated pulse effects for high-crowd gates
- Sparkline charts showing crowd trends
- Live status indicators

## Color Coding

- 🟢 **Green (Low)**: <80 people
- 🟡 **Yellow (Medium)**: 80-150 people
- 🟠 **Orange (High)**: 150-220 people
- 🔴 **Red (Critical)**: >220 people

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Future Enhancements

- [ ] Real API integration
- [ ] WebSocket for live updates
- [ ] User authentication
- [ ] Push notifications
- [ ] Admin dashboard
- [ ] Historical analytics
- [ ] Multi-venue support
- [ ] Mobile app (React Native)

## License

MIT

## Created By

Antigravity AI - Advanced Agentic Coding System
