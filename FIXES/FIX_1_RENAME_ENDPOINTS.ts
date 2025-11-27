/**
 * FIX #1: Rename API Endpoints
 * 
 * Problem: Frontend calls /api/users/* but backend provides /api/auth/*
 * Solution: Rename all /api/auth/* to /api/users/*
 * Time: 30 minutes
 * 
 * File: workers/src/index.ts
 */

// ============= BEFORE (WRONG) =============
// router.post('/api/auth/register', ...)
// router.post('/api/auth/login', ...)
// router.get('/api/auth/me', ...)
// router.put('/api/auth/profile', ...)
// router.post('/api/auth/change-password', ...)
// router.post('/api/auth/logout', ...)

// ============= AFTER (CORRECT) =============

// REGISTER
router.post('/api/users/register', async (request, env: Env) => {
  try {
    const body: any = await request.json();
    const { username, email, password, displayName } = body;

    if (!email || !password || !displayName) {
      return badRequestResponse('Missing required fields: email, password, displayName');
    }

    const result = await registerUser(env.DB, {
      username,
      email,
      password,
      displayName
    });

    return successResponse(result, 'Registration successful');
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
});

// LOGIN
router.post('/api/users/login', async (request, env: Env) => {
  try {
    const body: any = await request.json();
    const { username, email, password } = body;

    const identifier = username || email;

    if (!identifier || !password) {
      return badRequestResponse('Email/Username and password are required');
    }

    const result = await loginUser(env.DB, identifier, password);

    return successResponse(result, 'Login successful');
  } catch (error: any) {
    return errorResponse(error.message, 401);
  }
});

// LOGOUT
router.post('/api/users/logout', async (request, env: Env) => {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return unauthorizedResponse();
    }

    const token = authHeader.substring(7);
    await logoutUser(env.DB, token);

    return successResponse(null, 'Logout successful');
  } catch (error: any) {
    return errorResponse(error.message);
  }
});

// GET CURRENT USER
router.get('/api/users/me', async (request, env: Env) => {
  try {
    const userId = await requireAuth(request, env.DB);
    const user = await getUserById(env.DB, userId);

    return successResponse(user);
  } catch (error: any) {
    return unauthorizedResponse(error.message);
  }
});

// UPDATE PROFILE
router.put('/api/users/profile', async (request, env: Env) => {
  try {
    const userId = await requireAuth(request, env.DB);
    const body: any = await request.json();

    const { displayName, avatar, bio } = body;
    const updatedUser = await updateUserProfile(env.DB, userId, {
      displayName,
      avatar,
      bio
    });

    return successResponse(updatedUser, 'Profile updated');
  } catch (error: any) {
    return errorResponse(error.message);
  }
});

// CHANGE PASSWORD
router.post('/api/users/change-password', async (request, env: Env) => {
  try {
    const userId = await requireAuth(request, env.DB);
    const body: any = await request.json();

    const { oldPassword, newPassword } = body;

    if (!oldPassword || !newPassword) {
      return badRequestResponse('Old and new passwords are required');
    }

    await changePassword(env.DB, userId, oldPassword, newPassword);

    return successResponse(null, 'Password changed successfully');
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
});

// ============= TEST COMMANDS =============
/*
# Test 1: Register
curl -X POST http://localhost:8787/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"Test123456!",
    "displayName":"Test User",
    "username":"testuser"
  }'

# Test 2: Login
curl -X POST http://localhost:8787/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123456!"}'

# Test 3: Get Current User
curl -X GET http://localhost:8787/api/users/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Test 4: Update Profile
curl -X PUT http://localhost:8787/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"displayName":"New Name","bio":"My bio"}'

# Test 5: Change Password
curl -X POST http://localhost:8787/api/users/change-password \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"oldPassword":"Test123456!","newPassword":"NewPassword123!"}'

# Test 6: Logout
curl -X POST http://localhost:8787/api/users/logout \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
*/

// ============= CHECKLIST =============
/*
✅ Rename /api/auth/register to /api/users/register
✅ Rename /api/auth/login to /api/users/login
✅ Rename /api/auth/me to /api/users/me
✅ Rename /api/auth/profile to /api/users/profile
✅ Rename /api/auth/change-password to /api/users/change-password
✅ Rename /api/auth/logout to /api/users/logout
✅ Test all endpoints
✅ Verify frontend can call new endpoints
✅ Deploy to staging
*/

