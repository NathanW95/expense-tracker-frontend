# Expense Tracker Frontend

A React + TypeScript frontend application for managing business expenses. Built with Vite for optimal developer experience and performance.

**Author**: Nathan Williams (Junior Software Engineer II @ Booking.com)
**Purpose**: Enterprise Software Engineering Assignment 1

---

## 🔗 Quick Links

**Production Deployment:**
- **Frontend Application**: https://expense-tracker-frontend-3tjh.onrender.com/
- **Backend API**: https://expense-tracker-api-zsw5.onrender.com
- **API Documentation (Swagger)**: https://expense-tracker-api-zsw5.onrender.com/swagger-ui/index.html
- **Database**: PostgreSQL on Render (expires April 21, 2026)

**Source Code:**
- **Frontend Repository**: https://github.com/NathanW95/expense-tracker-frontend
- **Backend Repository**: https://github.com/NathanW95/expense-tracker-api

**Test Accounts**: See backend repo → `src/main/resources/db/migration/V4__add_test_users_and_expenses.sql`

---

## 🚀 Testing the Deployed Application

**Quick Start for Assessors:**

1. **Wake up the backend** (may take ~30s on first request):
   - Visit https://expense-tracker-api-zsw5.onrender.com/swagger-ui/index.html
   - Wait for all endpoints to load (confirms backend is running)

2. **Open the frontend**:
   - Visit https://expense-tracker-frontend-3tjh.onrender.com/
   - May take ~30s if frontend was also sleeping

3. **Login with test account**:
   - Check `V4__add_test_users_and_expenses.sql` in backend repo for credentials
   - Test different roles (USER, MANAGER, ADMIN) to see permission differences

4. **Test features**:
   - Create expense with receipt upload
   - Approve/reject expenses (manager/admin)
   - Filter by status, team, user
   - View statistics dashboard

**⚠️ Important**: Database expires **April 21, 2026**. Application will be fully functional until then.

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

### Authentication & Authorization
- ✅ User registration with team selection and password confirmation
- ✅ Email/password login
- ✅ JWT token authentication
- ✅ Persistent sessions (localStorage)
- ✅ Auto-login on page refresh
- ✅ Role-based access control (USER, MANAGER, ADMIN)
- ✅ Secure logout functionality
- ✅ Forgot password with email reset link (SendGrid)
- ✅ Password reset with token validation
- ✅ Profile management (view/edit first and last name)
- ✅ Password reset from profile page (reuses forgot password email)
- ✅ Team name display (fetched from backend)

### Expense Management (CRUD)
- ✅ View all expenses (responsive card grid layout)
- ✅ Create new expense with form validation
- ✅ Edit pending expenses (users can only edit their own)
- ✅ Delete pending expenses (with confirmation)
- ✅ **View switching (role-based)**:
  - USER: "My Expenses" only
  - MANAGER: "My Expenses" | "Team Expenses" tabs
  - ADMIN: "My Expenses" | "All Expenses" tabs
- ✅ **Filtering by status** (ALL, PENDING, APPROVED, REJECTED)
- ✅ **Filtering by team** (ADMIN only in All Expenses view)
- ✅ **Filtering by user** (MANAGER in Team view, ADMIN in All view)
- ✅ **Sorting** (Status/Date/Amount)
- ✅ **Statistics Dashboard**:
  - All-time stats (Total, Pending, Approved, Rejected)
  - Quarterly budget tracking ($1000 per person)
  - Team budget calculation (users × $1000)
  - Show/Hide toggle (open by default for managers/admins)
  - Client-side calculation for demo purposes
- ✅ Currency formatting and date display
- ✅ Manager approve/reject workflow for pending expenses
- ✅ Real-time expense updates after CRUD operations
- ✅ **Receipt Upload with Cloudinary**:
  - Direct frontend upload to Cloudinary (no backend file handling)
  - Unsigned upload preset for security
  - Receipt URLs stored in PostgreSQL
  - Visual "📎 View Receipt" button on expenses with receipts
  - Modal view with full expense details + receipt image
  - Managers can approve/reject directly from modal
  - Cloudinary CDN for fast global delivery

### User Interface
- ✅ Dark theme with modern card-based design
- ✅ Responsive grid layout (auto-fit, 320px min cards)
- ✅ Centered tabs, filters, and sort controls
- ✅ Role badge displayed under welcome message
- ✅ Visual separator between form and expense list
- ✅ Consistent 30px spacing throughout
- ✅ Button order: Reject (left) | Approve (right)
- ✅ No loading flash between view switches
- ✅ Hover effects on cards (lift and shadow)
- ✅ Color-coded status badges (Pending/Approved/Rejected)

### Technical Features
- ✅ Axios interceptor for automatic JWT injection
- ✅ Centralized API client configuration
- ✅ React Context for global auth state
- ✅ Custom useAuth hook for auth access
- ✅ Dark theme UI with modern design
- ✅ Responsive grid layout (3 cards per row on desktop)
- ✅ Loading and error states
- ✅ Type-safe TypeScript throughout
- ✅ Password confirmation validation on registration and reset

### Planned
- ✅ User profile page (view/edit name, reset password via email) (COMPLETED!)
- ✅ Receipt upload with Cloudinary (COMPLETED!)
- ✅ Deployment to Render (COMPLETED!)
- 🔲 Migrate statistics to backend endpoints (currently client-side for demo)

---

## Cloudinary Receipt Upload - Architecture & Implementation

### Overview
Receipts are uploaded directly from the frontend to Cloudinary using an **unsigned upload preset**, eliminating the need for API secrets in the client. The backend only stores and retrieves the receipt URL.

### Architecture Decision: Frontend Direct Upload

**Why Frontend Direct Upload?**
- ✅ **Faster**: Image goes straight to Cloudinary (no backend hop)
- ✅ **Simpler Backend**: No multipart/form-data handling needed
- ✅ **Scalable**: Cloudinary handles image optimization and CDN delivery
- ✅ **Industry Standard**: Used by Dropbox, Google Drive, etc.

### How It Works: Full Flow

**1. Upload Phase**
```
1. User clicks "Upload Receipt" in ExpenseForm
2. Cloudinary Upload Widget opens (loaded via CDN)
3. User selects image file
4. Frontend uploads directly to Cloudinary API
5. Cloudinary returns secure URL: "https://res.cloudinary.com/debbvzkxm/image/upload/v1234567890/receipts/abc123.jpg"
6. Frontend stores URL in component state
7. User submits expense form
8. Frontend sends URL to backend with expense data
```

**2. Storage Phase (Backend)**
```kotlin
// ExpenseRequest DTO
data class ExpenseRequest(
    val description: String,
    val amount: BigDecimal,
    val receiptUrl: String?  // ← Optional URL string
)

// ExpenseService saves to database
ExpenseEntity(
    description = request.description,
    amount = request.amount,
    receiptUrl = request.receiptUrl  // ← Saved to receipt_url column
)
```

**3. Retrieval Phase**
```
1. Frontend fetches expenses: GET /api/expenses
2. Backend queries database: SELECT * FROM expenses
3. Backend returns ExpenseResponse with receiptUrl field
4. Frontend receives: { id: 1, receiptUrl: "https://res.cloudinary.com/..." }
5. Frontend renders: <img src={expense.receiptUrl} />
6. Browser fetches image directly from Cloudinary CDN
```

### Security: Unsigned Upload Preset

**No API Secrets Needed!**
- Cloud Name: `debbvzkxm` (public, visible in all image URLs)
- Upload Preset: `expenses` (unsigned preset designed for client-side)
- No API key or secret required in frontend

**Security Enforced by Preset Configuration:**
- ✅ File types: Only jpg, png, gif, pdf allowed
- ✅ File size: Maximum 5MB
- ✅ Destination: All uploads go to `receipts/` folder
- ✅ No arbitrary uploads: Preset name required

**Why It's Safe to Commit These Values:**
The cloud name and preset name are not secrets—they're more like a public endpoint with built-in restrictions. The preset itself controls security server-side in Cloudinary.

### Database Schema

**Migration: V5__add_receipt_url.sql**
```sql
ALTER TABLE expenses ADD COLUMN receipt_url VARCHAR(500);
```

**Why VARCHAR(500)?**
Cloudinary URLs with transformations can be 200-300 characters. 500 provides safe overhead.

Example URL:
```
https://res.cloudinary.com/debbvzkxm/image/upload/c_fill,w_300,h_200,q_auto,f_auto/v1711384234/receipts/abc123def456.jpg
```

### Frontend Implementation

**Environment Variables (.env)**
```env
VITE_CLOUDINARY_CLOUD_NAME=debbvzkxm
VITE_CLOUDINARY_UPLOAD_PRESET=expenses
```

**Cloudinary Widget Integration (index.html)**
```html
<script src="https://upload-widget.cloudinary.com/global/all.js"></script>
```

**Upload Component (ExpenseForm.tsx)**
```typescript
const openCloudinaryWidget = () => {
  const widget = window.cloudinary.createUploadWidget(
    {
      cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
      uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
      sources: ['local', 'camera'],
      maxFileSize: 5000000, // 5MB
      folder: 'receipts',
    },
    (error, result) => {
      if (result.event === 'success') {
        setReceiptUrl(result.info.secure_url);
      }
    }
  );
  widget.open();
};
```

**Sending to Backend**
```typescript
await createExpense({
  description: formData.description,
  amount: formData.amount,
  expenseDate: formData.expenseDate,
  receiptUrl: receiptUrl,  // ← Cloudinary URL
});
```

### User Experience

**Creating Expense with Receipt:**
1. User fills expense form
2. Clicks "Upload Receipt" button
3. Cloudinary widget opens (professional UI)
4. Selects image → Preview appears
5. Can remove and re-upload if needed
6. Submits expense → Receipt URL saved

**Viewing Receipts:**
- Expenses with receipts show **"📎 View Receipt"** button
- Click button → Modal opens with:
  - Full expense details (category, status, description, amount, date)
  - Full-size receipt image (centered, max dimensions)
  - Approve/Reject buttons (for managers/admins)
- Click X or outside → Returns to expense list

**Manager Workflow:**
1. See expense with "📎 View Receipt" button
2. Click to view full details + receipt
3. Review everything in one modal (safety: can't accidentally approve wrong expense)
4. Approve or Reject directly from modal
5. Modal closes, expense list refreshes

### Production Considerations

**Flyway Migrations Don't Wipe Data:**
- Migrations are incremental and tracked by version
- V1, V2, V3, V4 already ran → Won't run again on redeploy
- V5 (add receipt_url) runs ONCE on first deploy
- Only ADDS column, doesn't delete existing data
- Test data persists across deployments

**Switching Between Local & Production:**
```env
# .env file
# Local development:
VITE_API_URL=http://localhost:8080

# Production (uncomment when deploying):
# VITE_API_URL=https://expense-tracker-api-zsw5.onrender.com
```

**Image Persistence:**
- Images uploaded to Cloudinary stay there permanently (unless manually deleted)
- URLs stored in PostgreSQL (prod or local DB)
- Sign out/in → Receipts still show (fetched from DB)
- Manual DB URL insertion works → Frontend displays any valid image URL

### Cloudinary Free Tier
- **Storage**: 25 GB
- **Bandwidth**: 25 GB/month
- **Transformations**: Included (resize, optimize, format conversion)
- **CDN Delivery**: Global edge servers for fast loading

### Future Enhancements (Not Implemented)
- Multiple receipts per expense
- Receipt deletion from Cloudinary (currently only from display)
- Security over file upload
- URL signing for private receipts

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

   The `.env` file configures the backend API URL and Cloudinary settings. The default configuration points to the deployed backend on Render.

   **Configuration Options:**

   **Option A: Use Deployed Backend (Default)**
   ```env
   # .env
   VITE_API_URL=https://expense-tracker-api-zsw5.onrender.com
   VITE_CLOUDINARY_CLOUD_NAME=debbvzkxm
   VITE_CLOUDINARY_UPLOAD_PRESET=expenses
   ```
   - Frontend connects to production backend on Render
   - No local backend setup required
   - Receipt uploads work immediately (Cloudinary)

   **Option B: Use Local Backend**
   ```env
   # .env
   VITE_API_URL=http://localhost:8080
   VITE_CLOUDINARY_CLOUD_NAME=debbvzkxm
   VITE_CLOUDINARY_UPLOAD_PRESET=expenses
   ```
   - Requires running backend locally (see backend README)
   - Useful for testing API changes
   - Receipt uploads still use production Cloudinary

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

## 🏗 Architecture

### Frontend Architecture Pattern: Component-Based + Service Layer

This React application follows a **component-based architecture** with clear separation between UI and data access:

**Architecture Layers:**

1. **Components & Pages** (UI Layer)
   - **Pages**: Login, Register, ForgotPassword, ResetPassword, Profile
   - **Components**: ExpenseList, ExpenseForm
   - Responsible for: Rendering UI, handling user interactions, local component state
   - **Does NOT**: Make direct API calls or contain business logic

2. **Services** (API Layer)
   - `api.ts`: Axios instance with JWT interceptor
   - `authApi.ts`: Authentication endpoints (login, register, password reset)
   - `expenseApi.ts`: Expense CRUD operations
   - `teamApi.ts`: Team data fetching
   - Responsible for: HTTP communication, API request/response handling
   - **Does NOT**: Know about React components or UI state

3. **Context API** (Global State)
   - `AuthContext` + `AuthProvider`: Global authentication state
   - `useAuth` hook: Access auth state from any component
   - Responsible for: User session, JWT token storage, auto-login on refresh
   - **Does NOT**: Make API calls directly (delegates to services)

4. **Types** (TypeScript Interfaces)
   - `expense.ts`: Expense, ExpenseRequest, ExpenseStatus, Category
   - `auth.ts`: User, AuthResponse, LoginRequest, RegisterRequest
   - Responsible for: Type safety, compile-time error checking
   - Matches backend DTOs for API contract consistency

**Design Patterns Used:**
- **Context API Pattern**: Global auth state without prop drilling
- **Custom Hooks**: `useAuth()` encapsulates auth logic for reusability
- **Axios Interceptors**: Automatic JWT injection on every request
- **Service Layer Pattern**: Separate API logic from UI components

**Why This Architecture:**
- ✅ **Type Safety**: TypeScript interfaces catch errors at compile time
- ✅ **Reusability**: Services and hooks used across multiple components
- ✅ **Testability**: Components can be tested with mocked services
- ✅ **Maintainability**: Clear separation of concerns (UI vs data fetching)
- ✅ **Scalability**: Easy to add new features without modifying core structure

---

## Project Structure

```
expense-tracker-frontend/
├── src/
│   ├── main.tsx              # Application entry point
│   ├── App.tsx               # Root component with auth routing
│   ├── App.css               # Global styles (dark theme)
│   ├── types/
│   │   ├── expense.ts        # Expense & ExpenseRequest interfaces
│   │   └── auth.ts           # User, AuthResponse, Login/Register types
│   ├── services/
│   │   ├── api.ts            # Shared Axios instance with JWT interceptor
│   │   ├── expenseApi.ts     # Expense CRUD operations
│   │   └── authApi.ts        # Authentication API calls
│   ├── context/
│   │   ├── AuthContext.tsx   # Auth context definition
│   │   └── AuthProvider.tsx  # Auth state provider
│   ├── hooks/
│   │   └── useAuth.ts        # Custom hook to access auth context
│   ├── components/
│   │   ├── ExpenseList.tsx   # Expense grid with card layout
│   │   └── ExpenseForm.tsx   # Create/Edit expense form
│   └── pages/
│       ├── Login.tsx         # Login page
│       ├── Register.tsx      # Registration page
│       ├── ForgotPassword.tsx # Forgot password page
│       ├── ResetPassword.tsx  # Reset password page
│       └── Profile.tsx        # User profile page
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

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with email/password
- `GET /api/auth/me` - Get current user (requires JWT)
- `PUT /api/auth/me` - Update user profile (first name, last name)
- `POST /api/auth/forgot-password` - Request password reset email
- `POST /api/auth/reset-password` - Reset password with token from email

### Expense Endpoints (Protected - JWT required)
- `GET /api/expenses/` - List expenses (user's own by default)
  - `?view=personal` - Explicitly get own expenses (needed for MANAGER)
  - `?view=team` - Get team expenses (MANAGER only)
- `GET /api/admin/expenses` - Get all expenses across all teams (ADMIN only)
- `GET /api/expenses/{id}` - Get expense by ID
- `POST /api/expenses/` - Create new expense (with optional receiptUrl)
- `PUT /api/expenses/{id}` - Update expense (only if PENDING and user owns it, can add/update receiptUrl)
- `DELETE /api/expenses/{id}` - Delete expense (only if PENDING and user owns it)
- `PUT /api/expenses/{id}/approve` - Approve or reject expense (manager/admin only)

### Team Endpoints
- `GET /api/teams` - Get all teams (used for registration dropdown and admin team filter with cascading user filter)
- `GET /api/teams/{id}` - Get team details *(Not currently used by frontend)*

### Team Endpoints
- `GET /api/teams` - Get all teams (used for registration dropdown and admin team filter with cascading user filter)
- `GET /api/teams/{id}` - Get team details *(Not currently used by frontend)*

### Statistics Endpoints *(Not currently used by frontend - client-side calculation for demo)*
- `GET /api/expenses/total-amount/` - Get total amount
- `GET /api/expenses/total-amount/{category}` - Get total by category
- `GET /api/expenses/average-amount/{category}` - Get average by category
- `GET /api/expenses/category/{category}` - Filter expenses by category

**Note**: Statistics are currently calculated client-side in the frontend for demo purposes. Backend endpoints exist for future migration to server-side calculation.

### JWT Authentication
All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

The Axios interceptor automatically adds this header to all requests.

See full API documentation at: https://expense-tracker-api-zsw5.onrender.com/swagger-ui/index.html

---

## Deployment

### Production Environment (Render)

**Live Services:**
- **Frontend Application**: https://expense-tracker-frontend-3tjh.onrender.com/
- **Backend API**: https://expense-tracker-api-zsw5.onrender.com
- **API Documentation**: https://expense-tracker-api-zsw5.onrender.com/swagger-ui/index.html
- **Cloudinary CDN**: https://res.cloudinary.com/debbvzkxm/ (receipt images)

**Environment Variables (Render Dashboard):**
- `VITE_API_URL` → `https://expense-tracker-api-zsw5.onrender.com`
- `VITE_CLOUDINARY_CLOUD_NAME` → `debbvzkxm`
- `VITE_CLOUDINARY_UPLOAD_PRESET` → `expenses`

**Deployment Strategy:**

This project uses **auto-deploy on commit** for rapid UX iteration:

1. Push to repository
2. Render auto-deploys immediately (no CI pipeline)
3. Runs `npm run build` (embeds env vars at build time)
4. Serves static files from `dist/` folder

**Why Auto-Deploy (No CI):**
- UX changes are validated locally before commit (visual testing in browser)
- Frontend changes don't require unit/integration test suite to pass
- Faster feedback loop for design iterations
- React build step catches TypeScript errors

**Contrast with Backend:**
- Backend uses CI-gated deployment (GitHub Actions → Render deploy hook)
- Backend requires tests to pass before deployment triggers
- Different trade-offs: Backend prioritizes correctness, frontend prioritizes iteration speed

**⚠️ Free Tier Limitations:**
- Frontend spins down after 15 minutes of inactivity
- First request after spin-down may be slow (~30s)

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

## ⚡ Quick Reference (Command Cheat Sheet)

### Local Development

**Install Dependencies:**
```bash
npm install
```

**Start Development Server:**
```bash
npm run dev
# Open http://localhost:5173
```

**Access Production:**
- Frontend: https://expense-tracker-frontend-3tjh.onrender.com/
- Backend API: https://expense-tracker-api-zsw5.onrender.com
- API Docs: https://expense-tracker-api-zsw5.onrender.com/swagger-ui/index.html

### Building & Quality

```bash
npm run build        # Build for production (outputs to dist/)
npm run preview      # Preview production build locally
npm run lint         # Check for linting issues
npm run lint:fix     # Auto-fix linting issues
npm run format       # Format all code with Prettier
npm run format:check # Check if code is formatted correctly
```

### Environment Variables

**Required in `.env` file:**
```env
VITE_API_URL=https://expense-tracker-api-zsw5.onrender.com
VITE_CLOUDINARY_CLOUD_NAME=debbvzkxm
VITE_CLOUDINARY_UPLOAD_PRESET=expenses
```

**Local Development:**
```env
VITE_API_URL=http://localhost:8080
```

### Test Accounts (Production)

Test accounts are defined in the backend's V4 Flyway migration. Refer to:
`expense-tracker-api/src/main/resources/db/migration/V4__add_test_users_and_expenses.sql`

This file contains all test account credentials (ADMIN, MANAGER, USER roles).

### Common Tasks

**Switch Between Local and Production Backend:**
1. Edit `.env` file
2. Change `VITE_API_URL` value
3. Restart dev server (`npm run dev`)

**Verify Build Works:**
```bash
npm run build && npm run preview
```

**Format Before Commit:**
```bash
npm run format && npm run lint
```

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

