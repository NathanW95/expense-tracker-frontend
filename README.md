# Expense Tracker Frontend

A React + TypeScript frontend application for managing business expenses. Built with Vite for optimal developer experience and performance.

**Backend API**: https://expense-tracker-api-zsw5.onrender.com
**API Documentation**: https://expense-tracker-api-zsw5.onrender.com/swagger-ui/index.html

---

## Tech Stack

- **React 19** - UI library
- **TypeScript 5.9** - Type safety
- **Vite 7.3** - Build tool (fast dev server, optimized builds)
- **Axios** - HTTP client for API calls
- **Prettier** - Code formatting
- **ESLint** - Code linting

---

## Features

### Current
- ✅ Project setup with Vite + React + TypeScript
- ✅ Environment configuration for API URL
- ✅ Axios HTTP client configured
- ✅ Code formatting with Prettier
- ✅ Linting with ESLint

### Planned
- 🔲 View all expenses (list/table)
- 🔲 Create new expense
- 🔲 Edit existing expense
- 🔲 Delete expense
- 🔲 Filter and sort expenses
- 🔲 Display expense statistics (total, average)
- 🔲 Authentication (login/register)
- 🔲 Deployment to Render

---

## Local Development Setup

### Prerequisites
- Node.js 20+ (or 22+, 24+)
- npm (comes with Node.js)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd expense-tracker-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   The `.env` file contains the backend API URL. Default configuration points to the deployed backend on Render.

4. **Start the development server**
   ```bash
   npm run dev
   ```

   Open http://localhost:5173 in your browser.

---

## Available Scripts

### Development
```bash
npm run dev          # Start dev server (port 5173)
npm run build        # Build for production (outputs to dist/)
npm run preview      # Preview production build locally
```

### Code Quality
```bash
npm run lint         # Check for linting issues
npm run lint:fix     # Auto-fix linting issues
npm run format       # Format all code with Prettier
npm run format:check # Check if code is formatted correctly
```

---

## Environment Variables

### VITE_API_URL
**Purpose**: Backend API base URL
**Local Default**: `https://expense-tracker-api-zsw5.onrender.com`
**Required**: Yes

**Note**: Frontend environment variables are NOT secret (visible in browser DevTools). The `VITE_` prefix is a Vite security feature that explicitly opts-in variables for client-side use.

---

## Project Structure

```
expense-tracker-frontend/
├── src/
│   ├── main.tsx              # Application entry point
│   ├── App.tsx               # Root component
│   ├── App.css               # Global styles
│   ├── types/                # TypeScript interfaces (coming soon)
│   ├── services/             # API service layer (coming soon)
│   ├── components/           # Reusable components (coming soon)
│   └── pages/                # Page components (coming soon)
├── public/                   # Static assets
├── .env                      # Environment variables (local, gitignored)
├── .env.example              # Environment template (committed)
├── .prettierrc               # Prettier configuration
├── .prettierignore           # Files to exclude from formatting
├── eslint.config.js          # ESLint configuration
├── tsconfig.json             # TypeScript configuration
├── vite.config.ts            # Vite configuration
└── package.json              # Dependencies and scripts
```

---

## Development Workflow

### Before Each Commit
1. Format code: `npm run format`
2. Check linting: `npm run lint`
3. Verify build: `npm run build`
4. Test in browser: `npm run dev`

### Commit Message Convention
Follow conventional commits format:
- `feat:` - New feature
- `fix:` - Bug fix
- `chore:` - Maintenance (deps, config)
- `style:` - Formatting, styling
- `docs:` - Documentation
- `refactor:` - Code restructuring

Example:
```
feat: add expense list component

```

---

## API Integration

The frontend communicates with a Spring Boot + Kotlin backend deployed on Render.

**Base URL**: `https://expense-tracker-api-zsw5.onrender.com`

**Key Endpoints**:
- `GET /expenses/` - List all expenses
- `GET /expenses/{id}` - Get expense by ID
- `POST /expenses/` - Create new expense
- `PUT /expenses/{id}` - Update expense
- `DELETE /expenses/{id}` - Delete expense
- `GET /expenses/total` - Get total amount
- `GET /expenses/summary` - Get expense summary

# !!! ABOVE WILL NEED UPDATING WHEN AUTH is added. !!!

See full API documentation at: https://expense-tracker-api-zsw5.onrender.com/swagger-ui/index.html

---

## Deployment

### Production Build
```bash
npm run build
```

This creates an optimized production build in the `dist/` folder. The build process:
1. Type-checks all TypeScript code
2. Bundles and minifies JavaScript
3. Optimizes assets
4. Embeds environment variables into the bundle


## Why Vite?

Vite provides significantly better developer experience compared to Create React App:

| Feature | Vite | Create React App |
|---------|------|------------------|
| Dev server start | <1s | ~30s |
| Hot reload | <100ms | ~5s |
| Module system | Native ES modules | Webpack bundling |
| TypeScript | esbuild (fast) | tsc (slower) |
| Build tool | Rollup | Webpack |

---

## Why TypeScript?

- **Type Safety**: Catch errors at compile time, not runtime
- **Better IDE Support**: Autocomplete, refactoring, inline documentation
- **Matches Backend**: Kotlin and TypeScript both provide strong typing
- **Industry Standard**: Most modern React projects use TypeScript

---

## Learning Resources

### React + TypeScript
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

### Vite
- [Vite Documentation](https://vite.dev/)
- [Vite Environment Variables](https://vite.dev/guide/env-and-mode.html)

### Axios
- [Axios Documentation](https://axios-http.com/docs/intro)

---

## Backend Repository

The backend API is a separate project built with Spring Boot + Kotlin:
- Backend GitHub: [https://github.com/NathanW95/expense-tracker-api]
- Backend Tech Stack: Spring Boot 3.4, Kotlin, PostgreSQL, Flyway, Docker

---

