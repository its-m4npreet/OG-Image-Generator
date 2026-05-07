# Quick Developer Guide - Persistent Authentication

## TL;DR

Users now stay logged in for 30 days. Session persists in:
- **httpOnly cookies** (primary - automatic)
- **localStorage** (backup - automatic)

No additional setup needed. Everything is automatic!

## Quick Start

### Start Development
```bash
pnpm run dev:all
```

### Test It
1. Go to `http://localhost:8000/login`
2. Login with GitHub or Google
3. Close browser completely
4. Reopen browser
5. **Still logged in!** ✅

## Using in Components

### Check if user is logged in
```tsx
'use client';
import { useIsAuthenticated } from '@/hook/use-session-restore';

export default function MyComponent() {
  const { isAuthenticated } = useIsAuthenticated();
  return isAuthenticated ? <Protected /> : <LoginPrompt />;
}
```

### Get user information
```tsx
'use client';
import { useCurrentSession } from '@/hook/use-session-restore';

export default function Profile() {
  const { user } = useCurrentSession();
  return <h1>Welcome {user?.name}</h1>;
}
```

### Check and restore session
```tsx
'use client';
import { useSessionRestore } from '@/hook/use-session-restore';

export default function Dashboard() {
  const { isRestored, hasValidSession } = useSessionRestore();
  
  if (!isRestored) return <Loading />;
  if (!hasValidSession) return <LoginRequired />;
  
  return <Dashboard />;
}
```

## File Structure

```
src/
├── lib/
│   ├── auth.ts                 # ✅ Modified: JWT strategy
│   └── token-storage.ts        # ✨ New: localStorage utilities
├── hook/
│   └── use-session-restore.ts  # ✨ New: React hooks

app/
├── providers.tsx               # ✅ Modified: SessionPersistenceHandler
```

## What Changed

| File | Change | Why |
|------|--------|-----|
| `src/lib/auth.ts` | `"database" → "jwt"` | Better persistence in browser |
| `app/providers.tsx` | Added `SessionPersistenceHandler` | Auto-save/clear sessions |
| `src/lib/token-storage.ts` | Created | Manage localStorage backup |
| `src/hook/use-session-restore.ts` | Created | Provide React hooks |

## How It Works (Simple)

```
User Logs In
    ↓
Token stored in httpOnly cookie ✓
Session backed up to localStorage ✓
User redirected to dashboard ✓

---

User Returns (Browser Closed & Reopened)
    ↓
NextAuth checks httpOnly cookie ✓
Token is valid ✓
Session restored automatically ✓
User sees dashboard (no login needed!) ✓

---

User Logs Out
    ↓
httpOnly cookie cleared by NextAuth ✓
localStorage cleared by our handler ✓
User fully logged out ✓
```

## Environment Variables

Already set in `.env.local`:

```env
NEXTAUTH_URL=http://localhost:8000
NEXTAUTH_SECRET=
GITHUB_ID=
GITHUB_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
DATABASE_URL=
```

No changes needed! ✅

## Common Questions

### Q: How do I manually clear the session?
```tsx
import { signOut } from 'next-auth/react';

// This automatically clears httpOnly cookie AND localStorage
await signOut({ callbackUrl: '/' });
```

### Q: How long does session last?
**30 days**. User must login again after 30 days for security.

### Q: Can users disable this?
Not with current setup. This is automatic. If you want a "Remember Me" checkbox later, we can add it.

### Q: Does this work on mobile?
Yes! Both cookies and localStorage work on mobile browsers.

### Q: Is this secure?
Yes! httpOnly cookies can't be accessed by JavaScript (prevents XSS). localStorage is additional backup.

### Q: What if user clears browser data?
They'll be logged out - this is normal secure behavior. No permanent storage outside the browser.

### Q: Can I see the stored data?
Yes! Open DevTools (F12) → Application → LocalStorage → look for `og_studio_session` key.

### Q: Do I need to do anything special in my components?
Nope! NextAuth/SessionProvider handles most of it. Use our hooks when you need to check auth status.

## Debugging

### User keeps getting logged out
1. Check `NEXTAUTH_SECRET` is set in `.env.local`
2. Check browser isn't clearing cookies automatically
3. Check `session.strategy` is `"jwt"` in `src/lib/auth.ts`

### localStorage not being saved
1. Open DevTools → Console
2. Check for errors
3. Verify `saveSessionToStorage` is being called
4. Check browser localStorage isn't disabled

### Session not restoring after reload
1. Check browser DevTools → Storage → LocalStorage
2. Look for `og_studio_session` key
3. Verify it hasn't expired
4. Check browser privacy settings

## Useful Links

- [Full Technical Docs](./PERSISTENT_AUTH_SETUP.md)
- [Implementation Summary](./PERSISTENT_AUTH_IMPLEMENTATION.md)
- [Original Auth Setup](./AUTH_SETUP.md)
- [NextAuth Docs](https://next-auth.js.org)
- [JWT Strategy](https://next-auth.js.org/configuration/options#session)

## Testing Checklist

- [ ] User can login with GitHub
- [ ] User can login with Google
- [ ] User stays logged in after page refresh
- [ ] User stays logged in after browser restart
- [ ] User can logout successfully
- [ ] localStorage is cleared on logout
- [ ] User can't access protected routes when logged out
- [ ] User redirected to dashboard when logged in

## Production Deployment

Before going live:

1. ✅ Set strong `NEXTAUTH_SECRET`
   ```bash
   openssl rand -base64 32
   ```

2. ✅ Use HTTPS only
   - Set `Secure` flag on cookies automatically

3. ✅ Monitor user sessions
   - Consider token refresh strategy
   - Set up session logging/analytics

4. ✅ Test thoroughly
   - Various browsers
   - Mobile devices
   - Various network conditions

## Need Help?

Check the documentation files:
- [PERSISTENT_AUTH_SETUP.md](./PERSISTENT_AUTH_SETUP.md) - Technical details
- [PERSISTENT_AUTH_IMPLEMENTATION.md](./PERSISTENT_AUTH_IMPLEMENTATION.md) - What changed
- [AUTH_SETUP.md](./AUTH_SETUP.md) - Original auth setup

---

**Happy coding! Your persistent auth is ready to go.** 🚀
