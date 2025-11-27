/**
 * FIX #4: Implement Token Expiration Validation
 * 
 * Problem: Tokens never expire, security vulnerability
 * Solution: Add token expiration check in requireAuth()
 * Time: 1 hour
 * 
 * File: workers/src/auth-service.ts
 */

// ============= CONSTANTS =============

const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours
const REFRESH_TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// ============= UPDATED REQUIRE AUTH FUNCTION =============

/**
 * Validate JWT token and check expiration
 * 
 * BEFORE (WRONG):
 * export async function requireAuth(request: Request, db: D1Database): Promise<string> {
 *   const authHeader = request.headers.get('Authorization');
 *   if (!authHeader?.startsWith('Bearer ')) {
 *     throw new Error('Missing authorization header');
 *   }
 *   const token = authHeader.substring(7);
 *   // ❌ NO VALIDATION - TOKEN ACCEPTED AS-IS
 *   return token;
 * }
 */

// AFTER (CORRECT):
export async function requireAuth(request: Request, db: D1Database): Promise<string> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('Missing authorization header');
  }

  const token = authHeader.substring(7);

  // ✅ VALIDATE TOKEN EXPIRATION
  const session = await db
    .prepare(
      `SELECT user_id FROM auth_sessions 
       WHERE token = ? AND expires_at > ? AND deleted_at IS NULL`
    )
    .bind(token, Date.now())
    .first();

  if (!session) {
    throw new Error('Token expired or invalid');
  }

  return session.user_id;
}

// ============= LOGIN - GENERATE TOKEN WITH EXPIRATION =============

export async function loginUser(
  db: D1Database,
  identifier: string,
  password: string
): Promise<{ user: any; token: string }> {
  // Find user
  const user = await db
    .prepare(
      `SELECT * FROM auth_users 
       WHERE (email = ? OR username = ?) AND deleted_at IS NULL`
    )
    .bind(identifier.toLowerCase(), identifier)
    .first();

  if (!user) {
    throw new Error('User not found');
  }

  // Verify password
  const isValid = await comparePassword(password, user.password_hash);
  if (!isValid) {
    throw new Error('Invalid password');
  }

  // ✅ GENERATE TOKEN WITH EXPIRATION
  const token = crypto.randomUUID();
  const expiresAt = Date.now() + TOKEN_EXPIRY_MS;
  const now = Date.now();

  // Store session with expiration
  await db
    .prepare(
      `INSERT INTO auth_sessions (id, user_id, token, expires_at, created_at)
       VALUES (?, ?, ?, ?, ?)`
    )
    .bind(crypto.randomUUID(), user.id, token, expiresAt, now)
    .run();

  // Update last login
  await db
    .prepare('UPDATE auth_users SET last_login = ? WHERE id = ?')
    .bind(now, user.id)
    .run();

  return {
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      displayName: user.display_name,
      avatar: user.avatar,
      bio: user.bio,
      createdAt: user.created_at,
      lastLogin: now,
    },
    token,
  };
}

// ============= REGISTER - GENERATE TOKEN WITH EXPIRATION =============

export async function registerUser(
  db: D1Database,
  data: { username?: string; email: string; password: string; displayName: string }
): Promise<{ user: any; token: string }> {
  const { username, email, password, displayName } = data;

  // Validate
  if (!email || !password || !displayName) {
    throw new Error('Missing required fields');
  }

  // Check if user exists
  const existing = await db
    .prepare('SELECT id FROM auth_users WHERE email = ? OR username = ?')
    .bind(email.toLowerCase(), username)
    .first();

  if (existing) {
    throw new Error('User already exists');
  }

  // Hash password
  const passwordHash = await hashPassword(password);
  const userId = crypto.randomUUID();
  const now = Date.now();

  // Create user
  await db
    .prepare(
      `INSERT INTO auth_users (id, username, email, password_hash, display_name, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .bind(userId, username || email, email.toLowerCase(), passwordHash, displayName, now)
    .run();

  // ✅ GENERATE TOKEN WITH EXPIRATION
  const token = crypto.randomUUID();
  const expiresAt = Date.now() + TOKEN_EXPIRY_MS;

  // Store session with expiration
  await db
    .prepare(
      `INSERT INTO auth_sessions (id, user_id, token, expires_at, created_at)
       VALUES (?, ?, ?, ?, ?)`
    )
    .bind(crypto.randomUUID(), userId, token, expiresAt, now)
    .run();

  return {
    user: {
      id: userId,
      email,
      username: username || email,
      displayName,
      createdAt: now,
    },
    token,
  };
}

// ============= LOGOUT - INVALIDATE TOKEN =============

export async function logoutUser(db: D1Database, token: string): Promise<void> {
  // Soft delete session (set deleted_at)
  await db
    .prepare('UPDATE auth_sessions SET deleted_at = ? WHERE token = ?')
    .bind(Date.now(), token)
    .run();
}

// ============= TOKEN REFRESH ENDPOINT =============

/**
 * Optional: Implement token refresh for better UX
 * 
 * POST /api/users/refresh-token
 * Body: { refreshToken: "..." }
 * Response: { token: "...", expiresAt: ... }
 */

export async function refreshToken(
  db: D1Database,
  refreshToken: string
): Promise<{ token: string; expiresAt: number }> {
  // Find refresh token
  const session = await db
    .prepare(
      `SELECT user_id FROM auth_sessions 
       WHERE token = ? AND expires_at > ? AND deleted_at IS NULL`
    )
    .bind(refreshToken, Date.now())
    .first();

  if (!session) {
    throw new Error('Refresh token expired or invalid');
  }

  // Generate new token
  const newToken = crypto.randomUUID();
  const expiresAt = Date.now() + TOKEN_EXPIRY_MS;
  const now = Date.now();

  // Store new session
  await db
    .prepare(
      `INSERT INTO auth_sessions (id, user_id, token, expires_at, created_at)
       VALUES (?, ?, ?, ?, ?)`
    )
    .bind(crypto.randomUUID(), session.user_id, newToken, expiresAt, now)
    .run();

  // Invalidate old refresh token
  await db
    .prepare('UPDATE auth_sessions SET deleted_at = ? WHERE token = ?')
    .bind(now, refreshToken)
    .run();

  return {
    token: newToken,
    expiresAt,
  };
}

// ============= TEST COMMANDS =============

/*
# Test 1: Login (get token with expiration)
curl -X POST http://localhost:8787/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123456!}'

# Response:
{
  "success": true,
  "data": {
    "user": {...},
    "token": "abc123..."
  },
  "message": "Login successful"
}

# Test 2: Use valid token
curl -X GET http://localhost:8787/api/users/me \
  -H "Authorization: Bearer abc123..."

# Response: 200 OK with user data

# Test 3: Use expired token (wait 24 hours or manually set expired_at in DB)
curl -X GET http://localhost:8787/api/users/me \
  -H "Authorization: Bearer expired_token"

# Response: 401 Unauthorized - Token expired or invalid

# Test 4: Use invalid token
curl -X GET http://localhost:8787/api/users/me \
  -H "Authorization: Bearer invalid_token"

# Response: 401 Unauthorized - Token expired or invalid

# Test 5: Refresh token (optional)
curl -X POST http://localhost:8787/api/users/refresh-token \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"old_token"}'

# Response:
{
  "success": true,
  "data": {
    "token": "new_token...",
    "expiresAt": 1234567890
  }
}
*/

// ============= CHECKLIST =============
/*
✅ Update requireAuth() to validate token expiration
✅ Update loginUser() to generate token with expiration
✅ Update registerUser() to generate token with expiration
✅ Update logoutUser() to soft delete session
✅ Add token refresh endpoint (optional)
✅ Test valid token
✅ Test expired token
✅ Test invalid token
✅ Test logout
✅ Deploy to staging
*/

