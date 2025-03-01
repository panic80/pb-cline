# Development Guide

## Commands
- `npm run dev` - Start development server with proxy (port 3001)
- `npm run build` - Build for production
- `npm run test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm test src/path/to/file.test.jsx` - Run specific test file
- `npm run deploy` - Deploy using PM2

## Code Style
- React functional components with TypeScript (React.FC<Props>)
- Component props defined with TypeScript interfaces
- camelCase for functions/variables, PascalCase for components
- Small, focused components with clear responsibility
- CSS modules or styled components for styling
- Default values in destructuring

## Project Structure
- `/src/components` - UI components
- `/src/api` - API integrations
- `/src/utils` - Utility functions
- `/src/new-chat-interface` - New modular chat implementation
- `/server` - Backend Express server

## Tech Stack
- React 18 + TypeScript + Vite
- Tailwind CSS
- Vitest for testing
- Express backend