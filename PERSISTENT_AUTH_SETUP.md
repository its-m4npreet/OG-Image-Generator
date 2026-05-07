# Persistent Authentication Setup

## Overview

Your app now implements **persistent authentication** using JWT strategy with localStorage backup. Users won't need to login again when they return to the page.

## What Changed

### 1. **JWT Session Strategy** (`src/lib/auth.ts`)
- Changed from `"database"` to `"jwt"` strategy
- JWT tokens are stored in **httpOnly cookies** (automatically managed by NextAuth)
- Tokens expire after **30 days**
- User role is fetched from database and included in the JWT token

### 2. **localStorage Backup** (`src/lib/token-storage.ts`)
- Session data is automatically saved to localStorage when users login
- Session is cleared from localStorage when users logout
- Provides additional persistence in case cookies are cleared
- Automatically expires stored sessions after 30 days

### 3. **Session Persistence Handler** (`app/providers.tsx`)
- New `SessionPersistenceHandler` component watches for session changes
- Automatically saves sessions to localStorage on login
- Automatically clears localStorage on logout
- Wrapped in the main `Providers` component

### 4. **Custom Hooks** (`src/hook/use-session-restore.ts`)
- `useSessionRestore()` - Restore session from localStorage
- `useIsAuthenticated()` - Quick auth status check
- `useCurrentSession()` - Get current user with type safety

## How It Works

### Login Flow
```
1. User clicks "Sign in with GitHub/Google"
   ↓
2. OAuth provider authenticates user
   ↓
3. NextAuth stores JWT token in httpOnly cookie
   ↓
4. Middleware validates token
   ↓
5. SessionProvider detects authenticated session
   ↓
6. SessionPersistenceHandler saves session to localStorage
   ↓
7. User redirected to /dashboard
```

### Return Visit Flow
```
1. User returns to page after browser restart
   ↓
2. NextAuth checks httpOnly cookie (automatic)
   ↓
3. If cookie exists, JWT is validated and restored
   ↓
4. If cookie expired, stored session in localStorage can help recovery
   ↓
5. If neither exists, user redirected to login
```

### Logout Flow
```
1. User clicks "Sign out"
   ↓
2. NextAuth clears httpOnly cookie
   ↓
3. SessionProvider detects unauthenticated state
   ↓
4. SessionPersistenceHandler clears localStorage
   ↓
5. User redirected to home page
```

## Using the Hooks in Components

### Check if user is authenticated
```tsx
'use client';

import { useIsAuthenticated } from '@/hook/use-session-restore';

export default function MyComponent() {
  const { isAuthenticated, isLoading } = useIsAuthenticated();

  if (isLoading) return <div>Loading...</div>;

  return isAuthenticated ? (
    <div>Welcome back!</div>
  ) : (
    <div>Please login</div>
  );
}
```

### Get current user information
```tsx
'use client';

import { useCurrentSession } from '@/hook/use-session-restore';

export default function Profile() {
  const { user, isAuthenticated } = useCurrentSession();

  if (!isAuthenticated) return <div>Not logged in</div>;

  return (
    <div>
      <h1>{user?.name}</h1>
      <p>{user?.email}</p>
    </div>
  );
}
```

## Environment Variables

Required variables (already in `.env.local`):

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:8000
NEXTAUTH_SECRET=<your-secret-key>

# OAuth Providers
GITHUB_ID=<your-github-id>
GITHUB_SECRET=<your-github-secret>
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/ogstudio
```

## Features

✅ **JWT-based Sessions** - Tokens stored in httpOnly cookies  
✅ **30-Day Expiration** - Users stay logged in for 30 days  
✅ **localStorage Backup** - Extra persistence layer  
✅ **Automatic Cleanup** - Sessions cleared on logout  
✅ **Role-based Access** - User roles fetched from database  
✅ **Server & Client Protection** - Protected routes via middleware  
✅ **OAuth Integration** - GitHub and Google login  

## Testing Persistent Authentication

### Test 1: Basic Persistence
1. Go to `http://localhost:8000/login`
2. Click "Sign in with GitHub/Google"
3. Verify redirected to `/dashboard`
4. Check browser localStorage (DevTools → Application → LocalStorage)
5. Close and reopen browser
6. Should still be on `/dashboard` - session restored!

### Test 2: Token Expiration
1. Login successfully
2. Check JWT token in cookies (DevTools → Application → Cookies)
3. Token should be valid for 30 days

### Test 3: Logout
1. Login and go to dashboard
2. Click "Sign out"
3. Verify localStorage is cleared
4. Verify redirected to home page
5. Try accessing `/dashboard` - should redirect to `/login`

## Architecture Diagram

```
┌─────────────────────────────────────────┐
│       Browser Local Storage             │
│  - Session data (30-day backup)         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│       Browser httpOnly Cookies          │
│  - JWT Token (managed by NextAuth)      │
│  - Secure, automatic                    │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│       NextAuth Session                  │
│  - JWT Strategy (decoded from token)    │
│  - Available to React components        │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│       Database (PostgreSQL)             │
│  - User data                            │
│  - User roles                           │
│  - Session data (if needed)             │
└─────────────────────────────────────────┘
```

## Security Considerations

1. **httpOnly Cookies** - JWT tokens in httpOnly cookies can't be accessed by JavaScript (prevents XSS attacks)
2. **NEXTAUTH_SECRET** - Keep this very secure, never commit to version control
3. **HTTPS Only** - Always use HTTPS in production (Secure flag on cookies)
4. **30-Day Expiration** - Users must re-authenticate after 30 days for security
5. **Role-based Access** - User roles are fetched from database with each session

## Troubleshooting

### User has to login every time
- **Cause**: JWT strategy not enabled or NEXTAUTH_SECRET not set
- **Fix**: Check `session.strategy` is `"jwt"` in `src/lib/auth.ts`

### Session not persisting to localStorage
- **Cause**: SessionPersistenceHandler not working
- **Fix**: Check browser console for errors, ensure Providers component wraps your app

### Lost session after browser close
- **Cause**: localStorage cleared by browser settings
- **Fix**: User browser privacy settings may be clearing localStorage on close

### Role not showing in session
- **Cause**: Database query failed in JWT callback
- **Fix**: Check PostgreSQL connection, verify `users` table has `role` column

## Next Steps

1. Test the persistent authentication in your app
2. Deploy to production
3. Monitor user sessions in production
4. Consider adding "Remember Me" checkbox if desired (optional)
5. Plan token refresh strategy for long-term sessions
