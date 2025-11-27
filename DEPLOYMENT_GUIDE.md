# DEPLOYMENT GUIDE - 8 Critical Fixes

## 🎯 Mục Tiêu

Áp dụng 8 fix quan trọng trong 3 ngày để đưa dự án từ 45% → 95% production-ready.

---

## 📅 Timeline

### Day 1: Fixes #1-3 (2 giờ)
- Rename endpoints
- Fix response format
- Add database columns

### Day 2: Fixes #4-8 (4 giờ)
- Token expiration
- Password reset
- Error boundaries
- Input validation
- Sync manager

### Day 3: Testing & Deployment (2 giờ)
- Comprehensive testing
- Deploy to staging
- Final verification

---

## 🚀 Day 1: Quick Wins (2 hours)

### Step 1: Rename Endpoints (30 minutes)

**File**: `workers/src/index.ts`

1. Find all `/api/auth/` routes
2. Replace with `/api/users/`
3. Test with curl commands

```bash
# Test
curl -X POST http://localhost:8787/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123456!","displayName":"Test"}'
```

✅ **Checkpoint**: Register endpoint works

---

### Step 2: Fix Response Format (45 minutes)

**File**: `workers/src/utils.ts`

1. Update `successResponse()` function
2. Update `errorResponse()` function
3. Add helper functions (badRequest, unauthorized, etc.)
4. Update all endpoints to use new functions

```typescript
// ✅ All responses should look like:
{
  "success": true,
  "data": {...},
  "message": "Success",
  "error": null,
  "timestamp": 1234567890
}
```

✅ **Checkpoint**: All API responses have consistent format

---

### Step 3: Add Database Columns (45 minutes)

**File**: `workers/schema.sql` and `workers/migrations/001_add_soft_deletes.sql`

1. Create migration file
2. Add `deleted_at` columns
3. Add `updated_at` columns
4. Create indexes
5. Run migration

```bash
# Run migration
cd workers
wrangler d1 execute ai-hoc-tap-db --file=migrations/001_add_soft_deletes.sql

# Verify
wrangler d1 execute ai-hoc-tap-db --command "PRAGMA table_info(exams);"
```

✅ **Checkpoint**: Database schema updated

---

## 🔐 Day 2: Security & Stability (4 hours)

### Step 4: Token Expiration (1 hour)

**File**: `workers/src/auth-service.ts`

1. Update `requireAuth()` to validate expiration
2. Update `loginUser()` to set expiration
3. Update `registerUser()` to set expiration
4. Test token validation

```bash
# Test valid token
curl -X GET http://localhost:8787/api/users/me \
  -H "Authorization: Bearer valid_token"

# Test expired token
curl -X GET http://localhost:8787/api/users/me \
  -H "Authorization: Bearer expired_token"
# Should return 401
```

✅ **Checkpoint**: Tokens expire after 24 hours

---

### Step 5: Password Reset (1 hour)

**File**: `workers/src/index.ts`

1. Remove insecure endpoint
2. Add request-password-reset endpoint
3. Add reset-password endpoint
4. Add verify-reset-token endpoint (optional)
5. Test password reset flow

```bash
# Test request reset
curl -X POST http://localhost:8787/api/users/request-password-reset \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Test reset (use token from logs)
curl -X POST http://localhost:8787/api/users/reset-password \
  -H "Content-Type: application/json" \
  -d '{"token":"abc123...","newPassword":"NewPassword123!"}'
```

✅ **Checkpoint**: Password reset is secure

---

### Step 6: Error Boundaries (1 hour)

**File**: `App.tsx`

1. Wrap all lazy routes with ErrorBoundary
2. Add componentName prop
3. Test error handling

```typescript
<Route path="/dashboard" element={
  <ProtectedRoute>
    <ErrorBoundary componentName="Dashboard">
      <Dashboard />
    </ErrorBoundary>
  </ProtectedRoute>
} />
```

✅ **Checkpoint**: App doesn't crash on component errors

---

### Step 7: Input Validation (1 hour)

**File**: `workers/src/middleware/validate.ts` (new file)

1. Create validation schemas
2. Add validateBody middleware
3. Update all endpoints to use validation
4. Test validation rules

```bash
# Test valid register
curl -X POST http://localhost:8787/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123456!","displayName":"Test"}'

# Test invalid email
curl -X POST http://localhost:8787/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"email":"invalid","password":"Test123456!","displayName":"Test"}'
# Should return 400
```

✅ **Checkpoint**: All inputs validated

---

### Step 8: Sync Manager (6 hours)

**File**: `utils/syncManager.ts`

1. Rewrite sync manager
2. Implement delta sync
3. Add conflict resolution
4. Add retry logic
5. Add offline queue
6. Test all features

```bash
# Monitor sync in console
console.log('[Sync] Starting full sync...');
console.log('[Sync] Completed in Xms');
```

✅ **Checkpoint**: Sync works efficiently

---

## ✅ Day 3: Testing & Deployment (2 hours)

### Comprehensive Testing (1 hour)

**Test Checklist**:

```bash
# 1. Authentication
curl -X POST http://localhost:8787/api/users/register ...
curl -X POST http://localhost:8787/api/users/login ...
curl -X GET http://localhost:8787/api/users/me ...
curl -X PUT http://localhost:8787/api/users/profile ...
curl -X POST http://localhost:8787/api/users/change-password ...
curl -X POST http://localhost:8787/api/users/logout ...

# 2. Exams
curl -X POST http://localhost:8787/api/exams ...
curl -X GET http://localhost:8787/api/exams ...
curl -X GET http://localhost:8787/api/exams/:id ...
curl -X DELETE http://localhost:8787/api/exams/:id ...

# 3. Flashcards
curl -X POST http://localhost:8787/api/flashcards/decks ...
curl -X GET http://localhost:8787/api/flashcards/decks ...
curl -X POST http://localhost:8787/api/flashcards/decks/:id/cards ...

# 4. Chat
curl -X POST http://localhost:8787/api/chat/sessions ...
curl -X GET http://localhost:8787/api/chat/sessions ...

# 5. Sync
curl -X GET http://localhost:8787/api/sync/changes?since=0 ...

# 6. Error Handling
- Navigate to each route
- Check for errors in console
- Verify error boundaries work
```

✅ **Checkpoint**: All tests pass

---

### Deploy to Staging (1 hour)

```bash
# 1. Commit all changes
git add .
git commit -m "Fix: Apply 8 critical fixes"

# 2. Deploy backend
cd workers
wrangler deploy

# 3. Deploy frontend
npm run build
# Deploy dist/ to hosting

# 4. Verify staging
curl -X GET https://staging.example.com/api/users/me

# 5. Run smoke tests
- Login/Register
- Create exam
- Create flashcard
- Chat
- Sync
```

✅ **Checkpoint**: Staging deployment successful

---

## 📊 Verification Checklist

### Before Deployment
- [ ] All 8 fixes applied
- [ ] All tests pass
- [ ] No console errors
- [ ] No linting errors
- [ ] Database migration successful
- [ ] Response format consistent
- [ ] Error boundaries working
- [ ] Validation working
- [ ] Sync working
- [ ] Token expiration working
- [ ] Password reset working

### After Deployment
- [ ] Staging accessible
- [ ] Login works
- [ ] Register works
- [ ] API endpoints respond
- [ ] Sync works
- [ ] No 500 errors
- [ ] No 401 errors
- [ ] Performance acceptable

---

## 🚨 Troubleshooting

### Issue: "Endpoint not found"
**Solution**: Check endpoint name in `workers/src/index.ts`
```bash
# Verify endpoint exists
curl -X GET http://localhost:8787/api/users/me
```

### Issue: "Invalid response format"
**Solution**: Check `successResponse()` in `workers/src/utils.ts`
```bash
# Verify response format
curl -X GET http://localhost:8787/api/users/me | jq .
```

### Issue: "Token validation failed"
**Solution**: Check `requireAuth()` in `workers/src/auth-service.ts`
```bash
# Verify token validation
curl -X GET http://localhost:8787/api/users/me \
  -H "Authorization: Bearer valid_token"
```

### Issue: "Database error"
**Solution**: Run migration again
```bash
cd workers
wrangler d1 execute ai-hoc-tap-db --file=migrations/001_add_soft_deletes.sql
```

### Issue: "Validation error"
**Solution**: Check validation schema in `workers/src/middleware/validate.ts`
```bash
# Test with valid data
curl -X POST http://localhost:8787/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123456!","displayName":"Test"}'
```

---

## 📈 Progress Tracking

| Fix | Status | Time | Notes |
|-----|--------|------|-------|
| #1 | ⬜ | 30m | Rename endpoints |
| #2 | ⬜ | 45m | Response format |
| #3 | ⬜ | 45m | Database schema |
| #4 | ⬜ | 1h | Token expiration |
| #5 | ⬜ | 1h | Password reset |
| #6 | ⬜ | 1h | Error boundaries |
| #7 | ⬜ | 6h | Sync manager |
| #8 | ⬜ | 1h | Input validation |
| **Testing** | ⬜ | 1h | Comprehensive tests |
| **Deployment** | ⬜ | 1h | Deploy to staging |

---

## 🎉 Success Criteria

✅ All 8 fixes applied  
✅ All tests pass  
✅ No errors in console  
✅ Staging deployment successful  
✅ Production ready: 95%

---

## 📞 Next Steps

1. Start with Day 1 (2 hours)
2. Continue with Day 2 (4 hours)
3. Finish with Day 3 (2 hours)
4. Deploy to production
5. Monitor for issues

---

**Total Time**: ~8 hours  
**Team**: 1-2 developers  
**Result**: 45% → 95% production-ready

**Let's go! 🚀**

