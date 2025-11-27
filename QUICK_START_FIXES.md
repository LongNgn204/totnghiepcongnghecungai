# QUICK START - APPLY THESE FIXES NOW

## 🔴 CRITICAL: 3 Fixes to Apply TODAY (2 hours)

### Fix 1: Rename Backend Endpoints (30 minutes)

**File**: `workers/src/index.ts`

**Find and Replace**:
```
/api/auth/register → /api/users/register
/api/auth/login → /api/users/login
/api/auth/me → /api/users/me
/api/auth/profile → /api/users/profile
/api/auth/change-password → /api/users/change-password
/api/auth/logout → /api/users/logout
/api/auth/forgot-password → DELETE THIS ENDPOINT (INSECURE)
```

**Why**: Frontend expects `/api/users/*` but backend provides `/api/auth/*`

---

### Fix 2: Fix Response Format (45 minutes)

**File**: `workers/src/utils.ts`

**Current Code**:
```typescript
export function successResponse(data: any, message?: string) {
  return new Response(JSON.stringify({
    success: true,
    data: data,
    message: message || 'Success',
    error: null
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', ...corsHeaders }
  });
}
```

**Check**: Ensure ALL endpoints use this wrapper consistently.

**Test**:
```bash
curl -X GET http://localhost:8787/api/users/me \
  -H "Authorization: Bearer test_token"
```

Should return:
```json
{
  "success": true,
  "data": {...},
  "message": "Success",
  "error": null
}
```

---

### Fix 3: Add Soft Delete Columns (45 minutes)

**File**: `workers/schema.sql`

**Add to each table**:
```sql
ALTER TABLE exams ADD COLUMN deleted_at INTEGER;
ALTER TABLE flashcard_decks ADD COLUMN deleted_at INTEGER;
ALTER TABLE flashcards ADD COLUMN deleted_at INTEGER;
ALTER TABLE chat_sessions ADD COLUMN deleted_at INTEGER;
ALTER TABLE study_sessions ADD COLUMN deleted_at INTEGER;
ALTER TABLE auth_users ADD COLUMN deleted_at INTEGER;

-- Add indexes
CREATE INDEX idx_exams_deleted ON exams(deleted_at);
CREATE INDEX idx_flashcard_decks_deleted ON flashcard_decks(deleted_at);
```

**Run**:
```bash
cd workers
wrangler d1 execute ai-hoc-tap-db --file=schema.sql
```

---

## ✅ VERIFICATION CHECKLIST

After applying fixes, test:

```bash
# Test 1: Register
curl -X POST http://localhost:8787/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"Test123456!",
    "displayName":"Test User",
    "username":"testuser"
  }'

# Expected: { "success": true, "data": { "user": {...}, "token": "..." } }

# Test 2: Login
curl -X POST http://localhost:8787/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123456!"}'

# Expected: { "success": true, "data": { "user": {...}, "token": "..." } }

# Test 3: Get Current User
curl -X GET http://localhost:8787/api/users/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Expected: { "success": true, "data": { "id": "...", "email": "..." } }
```

---

## 🟠 HIGH PRIORITY: Next 5 Fixes (4 hours)

### Fix 4: Add Token Expiration (1 hour)

**File**: `workers/src/auth-service.ts`

**Update `requireAuth()` function**:
```typescript
export async function requireAuth(request: Request, db: D1Database): Promise<string> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('Missing authorization header');
  }

  const token = authHeader.substring(7);
  
  // ✅ ADD THIS: Validate token expiration
  const session = await db.prepare(
    'SELECT user_id FROM auth_sessions WHERE token = ? AND expires_at > ?'
  )
    .bind(token, Date.now())
    .first();

  if (!session) {
    throw new Error('Token expired or invalid');
  }

  return session.user_id;
}
```

---

### Fix 5: Remove Insecure Password Reset (30 minutes)

**File**: `workers/src/index.ts`

**Delete this endpoint**:
```typescript
// ❌ DELETE THIS - SECURITY VULNERABILITY
router.post('/api/auth/forgot-password', async (request, env: Env) => {
  // Anyone can reset anyone's password!
  // ...
});
```

**Replace with secure version**:
```typescript
// ✅ ADD THIS - Secure password reset
router.post('/api/users/request-password-reset', async (request, env: Env) => {
  try {
    const body: any = await request.json();
    const { email } = body;

    if (!email) {
      return badRequestResponse('Email is required');
    }

    const user = await env.DB.prepare(
      'SELECT id FROM auth_users WHERE email = ?'
    )
      .bind(email.toLowerCase())
      .first();

    if (!user) {
      // Don't reveal if email exists
      return successResponse({ message: 'If email exists, reset link sent' });
    }

    // TODO: Generate reset token and send email
    // For now, just return success

    return successResponse({ message: 'If email exists, reset link sent' });
  } catch (error: any) {
    return errorResponse(error.message);
  }
});
```

---

### Fix 6: Add Error Boundaries (1 hour)

**File**: `App.tsx`

**Update all lazy routes**:
```typescript
<Route path="/san-pham-1" element={
  <ProtectedRoute>
    <ErrorBoundary componentName="Product1">
      <Product1 />
    </ErrorBoundary>
  </ProtectedRoute>
} />

<Route path="/san-pham-2" element={
  <ProtectedRoute>
    <ErrorBoundary componentName="Product2">
      <Product2 />
    </ErrorBoundary>
  </ProtectedRoute>
} />

// ... repeat for all routes
```

---

### Fix 7: Fix Sync Manager Response Format (1 hour)

**File**: `utils/syncManager.ts`

**Update response parsing**:
```typescript
async syncExams(): Promise<void> {
  try {
    const localExams = getExamHistory();
    const serverResponse = await api.exams.getAll(100, 0);
    
    // ✅ FIX: Handle response format correctly
    const serverExams = serverResponse.exams || serverResponse.data?.exams || [];
    
    // ... rest of logic
  } catch (error) {
    console.error('[Sync] Exam sync failed:', error);
  }
}
```

---

### Fix 8: Add Input Validation (1 hour)

**File**: `workers/src/index.ts`

**Add validation to register endpoint**:
```typescript
router.post('/api/users/register', async (request, env: Env) => {
  try {
    const body: any = await request.json();
    const { username, email, password, displayName } = body;

    // ✅ ADD VALIDATION
    if (!email || !password || !displayName) {
      return badRequestResponse('Missing required fields: email, password, displayName');
    }

    if (password.length < 8) {
      return badRequestResponse('Password must be at least 8 characters');
    }

    if (!email.includes('@')) {
      return badRequestResponse('Invalid email format');
    }

    // ... rest of logic
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
});
```

---

## 📝 SUMMARY

| Fix | File | Time | Priority |
|-----|------|------|----------|
| 1. Rename endpoints | workers/src/index.ts | 30m | P0 |
| 2. Fix response format | workers/src/utils.ts | 45m | P0 |
| 3. Add soft deletes | workers/schema.sql | 45m | P0 |
| 4. Token expiration | workers/src/auth-service.ts | 1h | P0 |
| 5. Remove insecure password reset | workers/src/index.ts | 30m | P0 |
| 6. Add error boundaries | App.tsx | 1h | P1 |
| 7. Fix sync response | utils/syncManager.ts | 1h | P1 |
| 8. Add validation | workers/src/index.ts | 1h | P1 |

**Total: ~6 hours**

---

## 🚀 DEPLOYMENT CHECKLIST

After applying all fixes:

- [ ] All tests pass
- [ ] No console errors
- [ ] Login/register works
- [ ] API endpoints respond correctly
- [ ] Sync works
- [ ] No security warnings
- [ ] Deploy to staging
- [ ] Run smoke tests
- [ ] Deploy to production

---

## 📞 NEED HELP?

If you get stuck:

1. Check the error message carefully
2. Look at the test curl commands
3. Check browser console for errors
4. Check server logs for errors
5. Ask for help in the team chat

**Good luck! 🎉**

